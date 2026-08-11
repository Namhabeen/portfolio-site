/**
 * 남하빈 포트폴리오 — Notion 기반 Apps Script 웹앱
 *
 * 동작 방식
 *  - GET ?company=슬러그  -> "지원회사별 설정" DB에서 slug로 매칭되는 행을 찾아
 *                      해당 회사용 프로젝트 조합 + 포지셔닝 문장 + 이력서/포트폴리오 파일 + 배지문구 + 페이지타이틀을 반환
 *  - GET (파라미터 없음) -> "포트폴리오 발행본" DB의 22개 전체를 표시순서대로 반환 (마스터 버전)
 *  - 없는 slug가 들어오면 -> 마스터(전체) 버전으로 자동 폴백
 *
 * 배포 전 준비
 *  1. Notion에서 Internal Integration 생성 (https://www.notion.so/my-integrations)
 *     → Integration Secret 복사
 *  2. "포트폴리오 발행본", "지원회사별 설정" 두 DB 페이지에서
 *     우측 상단 ... → Connections → 방금 만든 Integration 연결 (공유)
 *  3. 이 Apps Script 프로젝트의 [프로젝트 설정 → 스크립트 속성]에 아래 추가
 *       NOTION_TOKEN = ntn_xxxxxxxxxxxx  (Integration Secret)
 *  4. 배포 → 새 배포 → 유형: 웹 앱
 *       - 실행 계정: 나
 *       - 액세스 권한: 모든 사용자 (익명 포함)
 *     배포 후 나오는 웹 앱 URL을 사이트에서 fetch()로 호출
 */

// ── 설정 ──────────────────────────────────────────────
const PORTFOLIO_DB_ID = '5c1e5fa6-4a7f-48dc-a553-0332521b38ca'; // 포트폴리오 발행본
const CONFIG_DB_ID    = '70a606c0-5c02-4e9f-9cf2-c5064850cdbd'; // 지원회사별 설정
const NOTION_VERSION  = '2022-06-28';
const CACHE_SECONDS   = 3600; // 1시간 캐시

// 교육·글로벌 경험 카드는 "주요구현내용" 대신 "주요 수행 내용"으로 라벨만 다르게 표시
const EDUCATION_LABEL_COMPANIES = ['교육·글로벌', '서울시청년취업사관학교 x 러닝스푼즈', '미림마이스터고등학교'];

// ── 엔트리 포인트 ──────────────────────────────────────
function doGet(e) {
  const slug = e.parameter && e.parameter.company ? String(e.parameter.company).trim() : null;

  // 프로젝트 목록/슬러그 설정 캐시가 둘 다 비어있는 첫 요청(콜드 스타트)일 때,
  // Notion 조회 두 번을 순차 실행하지 않고 병렬로 보내서 지연을 줄인다.
  const cache = CacheService.getScriptCache();
  const projectsCold = !cache.get('portfolio_projects');
  const configCold = slug && !cache.get('config_' + slug);
  if (projectsCold || configCold) {
    warmCaches_(projectsCold, configCold ? slug : null);
  }

  const allProjects = getAllProjectsCached_();
  let result = {
    slug: null,
    positioning: null,
    targetJob: null,
    resumeUrl: null,
    portfolioUrl: null,
    badgeText: null,
    pageTitle: null,
    projects: sortByOrder_(allProjects),
    heroCopy : null
  };

  if (slug) {
    const config = findConfigBySlug_(slug);
    if (config && config.projectIds && config.projectIds.length > 0) {
      const idSet = {};
      config.projectIds.forEach(function (id) { idSet[id] = true; });

      const filtered = allProjects.filter(function (p) { return idSet[p.notionId]; });
      // configs에 적힌 노출프로젝트 순서를 그대로 표시 순서로 사용
      filtered.sort(function (a, b) {
        return config.projectIds.indexOf(a.notionId) - config.projectIds.indexOf(b.notionId);
      });

      result = {
        slug: slug,
        positioning: config.positioning,
        targetJob: config.targetJob,
        resumeUrl: config.resumeUrl || null,
        portfolioUrl: config.portfolioUrl || null,
        badgeText: config.badgeText || null,
        pageTitle: config.pageTitle || null,
        projects: filtered,
        heroCopy: config.heroCopy || null,
        featuredIds: config.featuredIds || [],
      };
    }
    // 매칭되는 slug가 없거나 노출프로젝트가 비어 있으면 -> 마스터(전체) 버전 그대로 반환
  }

  return jsonResponse_(result);
}

// ── Notion 조회 + 캐시 ─────────────────────────────────

/**
 * 프로젝트 목록 / 슬러그 설정 중 캐시가 비어있는 쪽을 UrlFetchApp.fetchAll로
 * 한 번에 병렬 요청해서 캐시를 미리 채워둔다. 결과가 여러 페이지(100건 초과)로
 * 나뉘는 경우나 요청이 실패한 경우는 채우지 않고 그냥 넘어가며, 이후
 * getAllProjectsCached_ / findConfigBySlug_가 평소처럼 순차 조회로 처리한다
 * (즉 실패해도 항상 정상 동작하고, 병렬화는 순수 속도 최적화일 뿐 정확성에는
 * 영향을 주지 않는다).
 *
 * @param {boolean} needProjects - 포트폴리오 발행본 캐시가 비어있는지 여부.
 * @param {string|null} slugToWarm - 채워야 할 슬러그. 없으면 null.
 */
function warmCaches_(needProjects, slugToWarm) {
  const token = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
  if (!token) return; // 토큰 관련 에러는 평소 경로에서 그대로 발생시킨다

  const requests = [];
  if (needProjects) {
    requests.push({
      key: 'projects',
      url: 'https://api.notion.com/v1/databases/' + PORTFOLIO_DB_ID + '/query',
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token, 'Notion-Version': NOTION_VERSION },
      payload: JSON.stringify({ page_size: 100 }),
      muteHttpExceptions: true,
    });
  }
  if (slugToWarm) {
    requests.push({
      key: 'config',
      url: 'https://api.notion.com/v1/databases/' + CONFIG_DB_ID + '/query',
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token, 'Notion-Version': NOTION_VERSION },
      payload: JSON.stringify({
        page_size: 100,
        filter: { property: 'slug', rich_text: { equals: slugToWarm } },
      }),
      muteHttpExceptions: true,
    });
  }
  if (requests.length < 2) return; // 병렬로 보낼 게 하나뿐이면 평소 경로와 차이 없음

  let responses;
  try {
    responses = UrlFetchApp.fetchAll(requests);
  } catch (err) {
    return; // 병렬 요청 자체가 실패해도 평소 경로가 재시도하므로 조용히 넘어감
  }

  const cache = CacheService.getScriptCache();

  requests.forEach(function (req, i) {
    const res = responses[i];
    if (res.getResponseCode() !== 200) return;

    const json = JSON.parse(res.getContentText());
    if (json.has_more) return; // 100건 넘는 페이지네이션은 평소 경로가 처리

    if (req.key === 'projects') {
      const projects = json.results.map(parseProjectPage_);
      cache.put('portfolio_projects', JSON.stringify(projects), CACHE_SECONDS);
    } else if (req.key === 'config') {
      if (json.results.length === 0) {
        cache.put('config_' + slugToWarm, JSON.stringify(null), 60);
      } else {
        const config = parseConfigPage_(json.results[0]);
        cache.put('config_' + slugToWarm, JSON.stringify(config), CACHE_SECONDS);
        rememberSlug_(slugToWarm);
      }
    }
  });
}

function getAllProjectsCached_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('portfolio_projects');
  if (cached) return JSON.parse(cached);

  const pages = queryNotionDatabase_(PORTFOLIO_DB_ID, null);
  const projects = pages.map(parseProjectPage_);

  cache.put('portfolio_projects', JSON.stringify(projects), CACHE_SECONDS);
  return projects;
}

function findConfigBySlug_(slug) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'config_' + slug;
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const filter = {
    property: 'slug',
    rich_text: { equals: slug },
  };
  const pages = queryNotionDatabase_(CONFIG_DB_ID, filter);
  if (pages.length === 0) {
    cache.put(cacheKey, JSON.stringify(null), 60); // 없는 slug는 짧게만 캐시
    return null;
  }

  const config = parseConfigPage_(pages[0]);
  cache.put(cacheKey, JSON.stringify(config), CACHE_SECONDS);
  rememberSlug_(slug);
  return config;
}

/**
 * 조회에 성공한 slug를 'known_slugs' 캐시 키에 배열로 누적 저장해서,
 * clearCache()가 어떤 config_<slug> 캐시 키들이 살아있는지 알 수 있게 한다
 * (CacheService에는 키 목록을 나열하거나 접두사로 지우는 기능이 없어서,
 * 이렇게 별도로 목록을 관리해야 한다).
 *
 * @param {string} slug - 방금 config_<slug> 캐시에 저장한 슬러그.
 */
function rememberSlug_(slug) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('known_slugs');
  const slugs = cached ? JSON.parse(cached) : [];
  if (slugs.indexOf(slug) === -1) {
    slugs.push(slug);
    cache.put('known_slugs', JSON.stringify(slugs), CACHE_SECONDS);
  }
}

function queryNotionDatabase_(databaseId, filter) {
  const token = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN');
  if (!token) throw new Error('NOTION_TOKEN이 스크립트 속성에 설정되어 있지 않습니다.');

  let results = [];
  let cursor = undefined;

  do {
    const body = { page_size: 100 };
    if (filter) body.filter = filter;
    if (cursor) body.start_cursor = cursor;

    const res = UrlFetchApp.fetch('https://api.notion.com/v1/databases/' + databaseId + '/query', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
        'Notion-Version': NOTION_VERSION,
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    });

    const code = res.getResponseCode();
    if (code !== 200) {
      throw new Error('Notion API 오류 (' + code + '): ' + res.getContentText());
    }

    const json = JSON.parse(res.getContentText());
    results = results.concat(json.results);
    cursor = json.has_more ? json.next_cursor : undefined;
  } while (cursor);

  return results;
}

// ── Notion 페이지 → 클린 JSON 파싱 ─────────────────────
function parseProjectPage_(page) {
  const p = page.properties;
  const company = getSelect_(p['회사']);

  return {
    notionId: page.id,
    cardName: getTitle_(p['카드명']),
    company: company,
    jobTags: getMultiSelect_(p['직무태그']),
    summary: getText_(p['그리드요약']),
    overview: getText_(p['프로젝트개요']),
    problem: splitLines_(getText_(p['문제상황'])),
    decisions: splitLines_(getText_(p['의사결정및역할'])),
    implementation: splitLines_(getText_(p['주요구현내용'])),
    implementationLabel: EDUCATION_LABEL_COMPANIES.indexOf(company) > -1 ? '주요 수행 내용' : '주요 구현 내용',
    results: splitLines_(getText_(p['성과'])),
    skillsShown: splitLines_(getText_(p['보여준역량'])),
    placeholderCategory: getText_(p['플레이스홀더카테고리']),
    placeholderKeywords: getText_(p['플레이스홀더키워드']),
    order: getNumber_(p['표시순서']),
    section: getSelect_(p['섹션구분']) || '프로젝트'
  };
}

function parseConfigPage_(page) {
  const p = page.properties;
  return {
    companyName: getTitle_(p['회사명']),
    slug: getText_(p['slug']),
    targetJob: getSelect_(p['지원직무']),
    positioning: getText_(p['포지셔닝문장']),
    projectIds: getRelation_(p['노출프로젝트']),
    featuredIds: getRelation_(p['대표프로젝트']),
    active: p['활성여부'] ? !!p['활성여부'].checkbox : false,
    resumeUrl: getFileUrl_(p['이력서파일']) || getUrl_(p['이력서URL']),
    portfolioUrl: getFileUrl_(p['포트폴리오파일']),
    badgeText: getText_(p['배지문구']),
    pageTitle: getText_(p['페이지타이틀']),
    heroCopy: getText_(p['히어로문구']),
  };
}

// ── 프로퍼티 파서 헬퍼 ─────────────────────────────────
function getTitle_(prop) {
  if (!prop || !prop.title || prop.title.length === 0) return '';
  return prop.title.map(function (t) { return t.plain_text; }).join('');
}
function getText_(prop) {
  if (!prop || !prop.rich_text || prop.rich_text.length === 0) return '';
  return prop.rich_text.map(function (t) { return t.plain_text; }).join('');
}
function getSelect_(prop) {
  if (!prop || !prop.select) return null;
  return prop.select.name;
}
function getMultiSelect_(prop) {
  if (!prop || !prop.multi_select) return [];
  return prop.multi_select.map(function (o) { return o.name; });
}
function getNumber_(prop) {
  if (!prop) return null;
  return prop.number;
}
function getRelation_(prop) {
  if (!prop || !prop.relation) return [];
  return prop.relation.map(function (r) { return r.id; });
}
function getUrl_(prop) {
  if (!prop || !prop.url) return null;
  return prop.url;
}
function getFileUrl_(prop) {
  if (!prop || !prop.files || prop.files.length === 0) return null;
  const file = prop.files[0];
  if (file.type === 'file') return file.file.url;
  if (file.type === 'external') return file.external.url;
  return null;
}
function splitLines_(text) {
  if (!text) return [];
  return text.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
}
function sortByOrder_(projects) {
  return projects.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
}

// ── 응답 ──────────────────────────────────────────────
function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 배포 전 수동 테스트용. Apps Script 에디터에서 이 함수를 직접 실행해보면
 * 로그(보기 → 로그)에 마스터 22개 JSON이 찍힙니다.
 */
function testMaster() {
  const result = doGet({ parameter: {} });
  Logger.log(result.getContent());
}

/**
 * 특정 slug 테스트용. CONFIG DB에 테스트용 행 하나 추가한 뒤 slug 값을 넣어 실행.
 */
function testSlug() {
  const result = doGet({ parameter: { company: 'hani' } });
  Logger.log(result.getContent());
}

/**
 * Notion 수정 후 캐시 만료(CACHE_SECONDS)를 기다리지 않고 즉시 반영하고 싶을 때 직접 실행.
 * portfolio_projects(마스터 프로젝트 목록)뿐 아니라, 'known_slugs'에 기록된 모든
 * slug의 config_<slug> 캐시까지 한 번에 지운다.
 */
function clearCache() {
  const cache = CacheService.getScriptCache();
  const keys = ['portfolio_projects', 'known_slugs'];

  const cachedSlugs = cache.get('known_slugs');
  if (cachedSlugs) {
    JSON.parse(cachedSlugs).forEach(function (slug) {
      keys.push('config_' + slug);
    });
  }

  cache.removeAll(keys);
  Logger.log('캐시 삭제 완료: ' + keys.join(', '));
}

/**
 * 시간 기반 트리거 전용. 사용자 요청과 무관하게 주기적으로 실행되어
 * portfolio_projects 캐시와, known_slugs에 기록된 모든 slug의 config_<slug>
 * 캐시를 항상 채워둔다. 이렇게 캐시를 미리 데워두면 실제 방문자 요청이
 * Notion API 왕복 없이 캐시에서 바로 응답받을 수 있다.
 */
function scheduledWarmCache_() {
  getAllProjectsCached_();

  const cache = CacheService.getScriptCache();
  const cachedSlugs = cache.get('known_slugs');
  if (!cachedSlugs) return;

  JSON.parse(cachedSlugs).forEach(function (slug) {
    findConfigBySlug_(slug);
  });
}

/**
 * 시간 기반 트리거 설정 방법:
 * Apps Script 에디터 좌측 시계 아이콘(트리거) → 트리거 추가 → 실행할 함수: scheduledWarmCache_
 * → 시간 기반 → 분 단위 타이머 → 5분마다(또는 10분마다) 실행되도록 설정
 */