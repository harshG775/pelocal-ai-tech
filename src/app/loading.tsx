import { Skeleton } from "@/components/ui/skeleton";

export const Loader = () => {
    return (
        <section className="flex justify-center items-center gap-4">
            <div className="animate-bounce delay-150">
                <Skeleton className="h-9 w-9 delay-150" />
            </div>

            <div className="animate-bounce delay-300">
                <Skeleton className="h-9 w-9 delay-300" />
            </div>

            <div className="animate-bounce delay-450">
                <Skeleton className="h-9 w-9 delay-450" />
            </div>
        </section>
    );
};

export default function PageLoading() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <Loader />
        </main>
    );
}
