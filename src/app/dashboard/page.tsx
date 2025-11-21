import { db } from '@/lib/firebase';
import Link from 'next/link';

// Force dynamic rendering to ensure we get the latest data
export const dynamic = 'force-dynamic';

async function getUsers() {
    try {
        const snapshot = await db.ref('visits').once('value');
        const data = snapshot.val();
        if (!data) return [];

        // Convert object to array of user IDs with last visit info
        return Object.keys(data).map(userId => {
            const visits = Object.values(data[userId]) as any[];
            const lastVisit = visits.sort((a, b) => b.timestamp - a.timestamp)[0];
            return {
                userId,
                lastVisit: new Date(lastVisit.timestamp).toLocaleString(),
                visitCount: visits.length
            };
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export default async function DashboardPage() {
    const users = await getUsers();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">User Tracking Dashboard</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No users tracked yet.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastVisit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.visitCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link href={`/dashboard/${user.userId}`} className="text-indigo-600 hover:text-indigo-900">
                                            View Journey
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
