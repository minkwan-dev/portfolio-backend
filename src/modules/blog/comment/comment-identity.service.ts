import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const DICEBEAR_STYLE = 'lorelei-neutral';
const DICEBEAR_BASE = 'https://api.dicebear.com/10.x';

export const ADJECTIVES = [ '재미있는', '활기찬', '용감한', '조용한', '빠른', '느긋한', '반짝이는', '든든한' ] as const;
  
export const MALE_NAMES = [ '영수', '영호', '영식', '영철', '광수', '상철' ] as const;
  
export const FEMALE_NAMES = [ '영숙', '정숙', '순자', '영자', '옥순', '현숙' ] as const;

export const NAMES = [...MALE_NAMES, ...FEMALE_NAMES] as const;

@Injectable()
export class CommentIdentityService {
    generate(): { nickname: string; avatar: string } {
        const nickname = `${pickRandom(ADJECTIVES)} ${pickRandom(NAMES)}`;
        const seed = randomUUID();

        return {
            nickname,
            avatar: `${DICEBEAR_BASE}/${DICEBEAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`,
        };
    }
}

function pickRandom<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}
