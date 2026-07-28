export const ADJECTIVES = [
    '재미있는', '활기찬', '용감한', '조용한', '빠른', '느긋한', '반짝이는', '든든한',
    '상냥한', '씩씩한', '유쾌한', '다정한', '명랑한', '차분한', '호기심 많은',
    '성실한', '따뜻한', '당당한', '센스 있는', '긍정적인', '친절한', '유머러스한',
    '똑똑한', '엉뚱한', '용맹한', '소심한', '대담한', '온화한',
] as const;

export const ALLOWED_AVATARS = [
    '/avatars/avatar01.svg',
    '/avatars/avatar02.svg',
    '/avatars/avatar03.svg',
    '/avatars/avatar04.svg',
    '/avatars/avatar05.svg',
    '/avatars/avatar06.svg',
    '/avatars/avatar07.svg',
    '/avatars/avatar08.svg',
    '/avatars/avatar09.svg',
    '/avatars/avatar10.svg',
    '/avatars/avatar11.svg',
    '/avatars/avatar12.svg',
    '/avatars/avatar13.svg',
    '/avatars/avatar14.svg',
    '/avatars/avatar15.svg',
] as const;

export const MALE_NAMES = ['영수', '영호', '영식', '영철', '광수', '상철'] as const;

export const FEMALE_NAMES = ['영숙', '정숙', '순자', '영자', '옥순', '현숙'] as const;

export const NAMES = [...MALE_NAMES, ...FEMALE_NAMES] as const;