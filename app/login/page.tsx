import LoginPage from "@/lib/pages/login_page";

interface PageProps {
    searchParams: {
        redirect: string
    }
}

export default async function Login({ searchParams }: PageProps) {
    const redirectPath = searchParams?.redirect ?? null;

    return (
        <LoginPage redirectTo={redirectPath} />
    );
}
