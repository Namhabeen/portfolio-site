/**
 * 남하빈 포트폴리오 — Notion 기반 Apps Script 웹앱
 *
 * 동작 방식
 *  - GET ?c=슬러그  -> "지원회사별 설정" DB에서 slug로 매칭되는 행을 찾아
 *                      해당 회사용 프로젝트 조합 + 포지셔닝 문장을 반환
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
const CACHE_SECONDS   = 600; // 10분 캐시

// 교육·글로벌 경험 카드는 "주요구현내용" 대신 "주요 수행 내용"으로 라벨만 다르게 표시
const EDUCATION_LABEL_COMPANIES = ['교육·글로벌', '서울시청년취업사관학교 x 러닝스푼즈', '미림마이스터고등학교'];

// ── 엔트리 포인트 ──────────────────────────────────────
function doGet(e) {
  const slug = e.parameter && e.parameter.c ? String(e.parameter.c).trim() : null;

  const allProjects = getAllProjectsCached_();
  let result = {
    slug: null,
    positioning: null,
    targetJob: null,
    projects: sortByOrder_(allProjects),
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
        projects: filtered,
      };
    }
    // 매칭되는 slug가 없거나 노출프로젝트가 비어 있으면 -> 마스터(전체) 버전 그대로 반환
  }

  return jsonResponse_(result);
}

// ── Notion 조회 + 캐시 ─────────────────────────────────
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
  return config;
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
    order: getNumber_(p['표시순서']),
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
  const result = doGet({ parameter: { c: 'example-company' } });
  Logger.log(result.getContent());
}
