import React, { useEffect, useState } from "react";
import axios from "axios";

const AggregatePage = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5001/api/aggregate")
            .then((res) => setData(res.data))
            .catch((err) => console.log("Error fetching aggregate data:", err));
    }, []);

    return (
        <div>
            <h2>Агрегированные данные по категориям:</h2>
            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item._id}>
                        <h3>{item._id}: ${item.total}</h3>
                    </div>
                ))
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    );
};

export default AggregatePage;
