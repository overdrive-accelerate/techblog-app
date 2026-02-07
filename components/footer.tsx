export function Footer() {
    return (
        <footer className="mt-12 border-t">
            <div className="text-muted-foreground container mx-auto px-4 py-8 text-center text-sm">
                <p>
                    &copy; {new Date().getFullYear()} TechBlog. Built with Bun, Next.js, Hono and
                    Better-Auth.
                </p>
            </div>
        </footer>
    );
}
