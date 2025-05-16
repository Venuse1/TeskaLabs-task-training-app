import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'asab_webui_components';

//function - fetching endpoint get /data to get id's
const getIds = async () => {
    const res = await fetch("https://devtest.teskalabs.com/data");
      
    const resJson = await res.json();
    const data = resJson.data;
    
    let id = []
    for (let user of data){
        const userId = user.id;
        id.push(userId);
    }
    return id;
}

//function - fetching detail data acording to specific id and saving them in variables
const getUserData = async (id) => {

    const res = await fetch(`https://devtest.teskalabs.com/detail/${id}`);
    const data = await res.json();
    const {username, email, created, last_sign_in, address, phone_number, ip_address, mac_address} = data;
    return {username, email, created, last_sign_in, address, phone_number, ip_address, mac_address};
};



export function DetailScreen(props) {
    const { t } = useTranslation();
    const [usersData, setUsersData] = useState([]);

// calls both fetching functions to get an object with data for every userId and saving data in usersData array
    useEffect(() => {
        const fetchData = async () => {
            try{
                const id = await getIds();
                const usersData = await Promise.all(
                    id.map((oneId) => {
                        return getUserData(oneId)
                    })
                );
                setUsersData(usersData);
            } catch(err){
                console.error("Error fetching data", err);
                setError(err);
            }
        }
        fetchData();
    }, []);

        return (
        <>
        <div className='container p-5 pb-0 mt-3 d-flex justify-content-between'>
            <h1><i className='bi bi-people-fill'></i>{t("DetailScreen|Users detail screen")}</h1>
            <a href="/" className='align-self-center btn btn-lg btn-outline-primary rounded-1'>{t('DetailScreen|Back to table')}</a>
        </div>
        <div className='container text-center p-5'>
            <div className="row g-3">
                {
                    usersData.map((user) => { //mapping thru array, creating card with information for every object in array
                        return(
                            <div className="col-lg-4 col-md-6 col-xs-12">
                                <div className="card h-100">
                                    <div className="card-title d-flex justify-content-center flex-nowrap">
                                        <h4 className="m-1 mt-2"><i className='bi bi-person-fill'></i> {user.username}</h4>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item m-1">
                                            <p><i class="bi bi-telephone-fill"></i> {user.phone_number}</p>
                                            <p><i class="bi bi-envelope-fill"></i> {user.email}</p>
                                            <p><i class="bi bi-geo-alt-fill"></i> {user.address}</p>
                                        </li>
                                        <li className="list-group-item m-1">
                                            <p><b>{t("DetailScreen|User was created")}</b> <DateTime value={user.created} /> </p>
                                            <p><b>{t("DetailScreen|Last sign in")}</b> <DateTime value={user.last_sign_in} /></p>  
                                        </li>
                                        <li className="list-group-item m-1">
                                            <p><b>{t("DetailScreen|IP address")}</b> {user.ip_address}</p>
                                            <p><b>{t("DetailScreen|Mac address")}</b> {user.ip_address}</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                        
                    })
                }
            </div> 
        </div>
        </> 
    );
}
