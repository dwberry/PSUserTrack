import { db } from '@/lib/firebase';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        userId: string;
    };
}

async function getUserJourney(userId: string) {
    try {
        const snapshot = await db.ref(`visits/${userId}`).once('value');
        const data = snapshot.val();
        if (!data) return [];

        return Object.values(data).sort((a: any, b: any) => b.timestamp - a.timestamp) as any[];
    } catch (error) {
        console.error('Error fetching user journey:', error);
        return [];
    }
}

export default async function UserJourneyPage({ params }: PageProps) {
    const { userId } = params;
    const journey = await getUserJourney(userId);

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Journey for User: {userId}</h1>
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-900">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {journey.length === 0 ? (
                        <li className="px-6 py-4 text-center text-gray-500">No visits recorded for this user.</li>
                    ) : (
                        journey.map((visit, index) => (
                            <li key={index} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-indigo-600 truncate">
                                        {visit.path}
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {new Date(visit.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Query: {visit.query || 'None'}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
