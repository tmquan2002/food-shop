import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import UserList from './UserList';
import ProductList from './ProductList';
import { productSlice } from '../manage/productSlices'
import { useDispatch, useSelector } from 'react-redux';
import AddUpdateProduct from './AddUpdateProduct';

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Feature(props) {
  const feature = props.feature;
  if (feature === "add" || feature === "update") {
    return <AddUpdateProduct />
  }
  return <ProductList />;
}

export default function AdminTabs() {
  const [value, setValue] = useState(0);
  const productSelector = useSelector((state) => state.manageProduct)
  const dispatch = useDispatch()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="detail-dashboard-container">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Manage Users" />
            <Tab label="Manage Products" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <UserList />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Feature feature={productSelector.feature} />
        </TabPanel>
      </Box>
      <Snackbar
        open={productSelector.notification.open} autoHideDuration={3000}
        onClose={() => dispatch(productSlice.actions.closeMessageNotification())}
      >
        <Alert onClose={() => dispatch(productSlice.actions.closeMessageNotification())}
          severity="success" sx={{ width: '100%' }}>
          {productSelector.notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
