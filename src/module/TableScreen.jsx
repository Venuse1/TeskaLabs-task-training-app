import React from 'react';
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { DataTableCard2  } from 'asab_webui_components';
import { Tooltip } from 'react-tooltip';
import { DateTime } from 'asab_webui_components';


// const loader = async ({params}) => {
// 	let response = await fetch(`https://devtest.teskalabs.com/data?${{params: params}}`)
// 	let responseJson = await response.json()
// 	let data = responseJson.data
// 	const rows = data;
// 	const count = data.length;
// 	console.log(params);
// 	return { count, rows } ;
// }

const loader = async ({ params }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.p) queryParams.append('page', params.p); 
      if (params.i) queryParams.append('limit', params.i);
      
      const response = await fetch(`https://devtest.teskalabs.com/data?${queryParams.toString()}`);
      
      const responseJson = await response.json();
      const data = responseJson.data;
      
      const page = parseInt(params.p) ;
      const limit = parseInt(params.i) ;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedRows = data.slice(startIndex, endIndex);

      return { 
        rows: paginatedRows, 
        count: responseJson.count 
      };
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };





export function TableScreen(props) {
	const { t } = useTranslation();

	const columns = [
	
		{
			title: t("TableScreen|User Name"),
			thStyle: {minWidth: "2rem"},
			render: ({ row }) => (
				<>
					<div
					data-tooltip-id="user-tooltip"
					data-tooltip-content={`ID: ${row.id}`}
					>
					{row.username}
					</div>
					<Tooltip place="top" id="user-tooltip" />
				</>
				
			) 
		},
		{
			title: "Email",
			thStyle: {minWidth: "2rem"},
			render: ({ row }) => row.email
		},
		{
			title: t("TableScreen|Address"),
			thStyle: {minWidth: "3rem"},
			render: ({ row }) => row.address
		},
		{
			title: t("TableScreen|Created"),
			thStyle: {minWidth: "2rem"},
			render: ({ row }) => (
				<>
					<DateTime value={row.created} />
				</>
			)
		},
		{
			title: t("TableScreen|Last sign in"),
			thStyle: {minWidth: "2rem"},
			render: ({ row }) => (
				<>
					<DateTime value={row.last_sign_in} />
				</>
			)
		}
	];
	
	const Header = () => {
		return	(
		<div  className='d-flex'>
			
			<h2><i className='bi bi-people-fill m-2'></i>{t("TableScreen|Data Table")}</h2>
	
		</div>);
	};

		return (
		<Container className='h-100'>
			<DataTableCard2
				app={app}
				columns={columns}
				loader={loader}
				header={<Header />}
				hideFooter={false}
			/>
		</Container>
	);
}
