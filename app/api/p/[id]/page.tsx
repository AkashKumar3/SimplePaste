type PageProps = {
    params: {
        id: string;
    };
};

export default async function PastePage({ params }: PageProps) {
    const res = await fetch(`/api/pastes/${params.id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return <h1>404 – Paste Unavailable</h1>;
    }

    const data: {
        content: string;
    } = await res.json();

    return (
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {data.content}
        </pre>
    );
}
