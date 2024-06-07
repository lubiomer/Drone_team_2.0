import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import FullScreenLoader from './FullScreenLoader';
import { getMeAPI } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/getMeAPI';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [cookies] = useCookies(['isLoggedIn']);

    const location = useLocation();
    const { isLoading, isFetching } = getMeAPI.endpoints.getMe.useQuery(null, {
        skip: false,
        refetchOnMountOrArgChange: true,
    });

    const loading = isLoading || isFetching;

    const user = getMeAPI.endpoints.getMe.useQueryState(null, {
        selectFromResult: ({ data }) => data!,
    });

    if (loading) {
        return <FullScreenLoader />;
    }

    return (cookies.isLoggedIn || user) &&
        allowedRoles.includes(user?.role as string) ? (
        <Outlet />
    ) : cookies.isLoggedIn && user ? (
        <Navigate to='/unauthorized' state={{ from: location }} replace />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequireUser;
