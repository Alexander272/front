import React from 'react'
import classes from './App.css'
import Main from './Containers/Main/Main'
import Layout from './Hoc/Layout/Layout';

function App() {
	return (
		<Layout>
			<div className = {classes.App}>
				<Main />
			</div>
		</Layout>
   )
}

export default App