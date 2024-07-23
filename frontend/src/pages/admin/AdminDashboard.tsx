/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGetAdminDashboardQuery } from "../../redux/api/statsAPI";
import { Container } from "reactstrap";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import FullScreenLoader from "../../components/FullScreenLoader";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController
);

const AdminDashboard = () => {
    const { data: statData, isLoading, refetch } = useGetAdminDashboardQuery({});

    useEffect(() => {
        refetch()
    }, []);

    const cdata = {
        labels: statData?.userData,
        datasets: [
            {
                label: 'Orders',
                backgroundColor: '#bcbbdd',
                borderColor: '#bcbbdd',
                borderWidth: 1,
                data: statData?.countData,
            },
            {
                label: 'Quantity',
                backgroundColor: '#e9340e',
                borderColor: '#e9340e',
                borderWidth: 1,
                data: statData?.quantityData,
            },
            {
                label: 'Total Price', 
                backgroundColor: '#297dd1',
                borderColor: '#297dd1',
                borderWidth: 1,
                data: statData?.quantityData,
            },
        ],
    };


    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view drone-background">
                    <Container>
                        <div className="chart-container mt-5">
                            <Bar
                                data={cdata}
                                options={{
                                    ...options,
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </Container>
                </div>
            )}
        </>

    )
}

export default AdminDashboard;