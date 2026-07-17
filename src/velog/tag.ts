import { VelogPost } from "@/velog/post";

export function extractTags(posts: VelogPost[]): string[] {
    const set = new Set<string>();

    for (const post of posts) {
        for (const name of post.tags ?? []) {
            set.add(name);
        }
    }

    return [...set];
}