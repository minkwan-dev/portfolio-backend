export class VelogClient {
    private readonly url = 'https://v2.velog.io/graphql';

    async request<T>(query: string, variables: Record<string, unknown>): Promise<T> {
        const res = await fetch(this. url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        })

        if (!res.ok) {
            throw new Error(`Velog API 실패: ${res.status}`);
        }

        const data = await res.json();

        if (data.errors?.length) {
            throw new Error(data.errors.map((e: { message: string }) => e.message).join(', '));
        }

        return data
    }
}