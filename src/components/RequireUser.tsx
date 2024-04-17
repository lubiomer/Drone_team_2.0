import { Navigate, Outlet, useLocation } from 'react-router-dom';
import FullScreenLoader from './FullScreenLoader';
import { getMeAPI } from '../redux/api/getMeAPI';
import { getToken } from '../utils/Utils';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const location = useLocation();
    const accessToken = getToken();
    const { isLoading, isFetching } = getMeAPI.endpoints.getMe.useQuery(null, {
        skip: false,
        refetchOnMountOrArgChange: true,
    });

    const loading = isLoading || isFetching;

    const user = getMeAPI.endpoints.getMe.useQueryState(null, {
        selectFromResult: ({ data }) => data!,
    });

    console.log({ loading });
    if (loading) {
        return <FullScreenLoader />;
    }

    return (accessToken || user) &&
        allowedRoles.includes(user?.role as string) ? (
        <Outlet />
    ) : accessToken && user ? (
        <Navigate to='/unauthorized' state={{ from: location }} replace />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequireUser;
