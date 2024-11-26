import { Head } from "@inertiajs/react";
import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout  from "@/Layouts/AuthenticatedLayout";
function Home() {
    return (
        <>
            {" "}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout children={page}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};
export default Home;
