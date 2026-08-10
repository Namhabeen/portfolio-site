/**
 * Maps a project's Notion `notionId` (its page ID, stable across reorders)
 * to its representative image filename in `public/images/projects/`.
 *
 * This is a stopgap for the Notion "이미지" field: no file has been
 * uploaded there yet, so `project.imageUrl` is always empty. It used to be
 * keyed by the `order` field, but `order` is a display-order value that
 * gets reassigned whenever projects are reordered in Notion, which
 * silently detached images from the wrong projects. `notionId` doesn't
 * change, so it doesn't have that problem. Once the Notion "이미지" field
 * is actually populated, this local mapping can be retired in favor of
 * `project.imageUrl`.
 *
 * @type {Record<string, string>}
 */
export const PROJECT_IMAGES = {
  '3b565ea2-853f-8154-bc07-c61716c29836': 'kanban-notion.png', // 개발팀 협업·문서화 체계 구축
  '3b565ea2-853f-8160-b466-d5585f007678': 'notification-system.png', // 사내 통합 알림 체계 구축
  '3b565ea2-853f-8137-80ae-f1a9be0718a5': 'migration.png', // 23만 건 그룹웨어 문서 마이그레이션
  '3b565ea2-853f-81d8-98fd-f984b0ec2596': 'erp-integration.png', // ERP - 쇼핑몰 데이터 연동 API 구축
  '3b565ea2-853f-81d9-a51e-d78c324b0a3c': 'phishing.png', // 사내 모의피싱 캠페인 시스템 구축
  '3b565ea2-853f-8173-bad6-eadf4ecc0896': 'meeting-room.png', // 다사업장 회의실 예약 시스템
  '3b565ea2-853f-817d-b8e0-f02b05644276': 'overstock_view.png', // 과재고 사후관리 시스템
  '3b565ea2-853f-81d4-b271-d3b8891c0ed4': 'product-analysis.png', // 구매 데이터 기반 상품 분석
  '3b565ea2-853f-81b3-87ee-dbf3767eca63': 'coupon.png', // LMS·백오피스 운영 기능 개발
  '3b565ea2-853f-818e-82b7-ef7ba1240721': 'japan-intern.png', // 상상로켓 - 일본 글로벌 인턴십
  '3b565ea2-853f-81ac-af1b-d6f4c937eaa9': 'thai-mtc.png', // 태국 Minburi Technical College 교류
};

/**
 * Resolves the public URL for a project's locally-hosted image, if one is
 * mapped for its `notionId`.
 *
 * @param {string | undefined} notionId - The project's `notionId` field.
 * @returns {string | null} The image URL, or null if no image is mapped.
 */
export function getProjectImageUrl(notionId) {
  const filename = PROJECT_IMAGES[notionId];
  if (!filename) return null;
  return `${import.meta.env.BASE_URL}images/projects/${filename}`;
}
