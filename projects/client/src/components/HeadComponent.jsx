import React from 'react';
import { Helmet } from 'react-helmet';

export default function HeadComponent({title, description, type}) {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title}</title>
			<meta name="description" content={description} />
			{/* End standard metadata tags */}

			{/* Facebook tags */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content="https://i.ibb.co/rtxqpHY/favicon-2.jpg"></meta>
			{/* End Facebook tags */}

			{/* Twitter tags */}
			<meta name="twitter:card" content={type} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta property="twitter:image" content="https://i.ibb.co/rtxqpHY/favicon-2.jpg"></meta>
			{/* End Twitter tags */}
		</Helmet>
	);
}
