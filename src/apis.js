import axios from 'axios';

export const getToken = async () => {
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_secret', process.env.REACT_APP_CLIENT_SECRET);
  data.append('scope', 'https://graph.microsoft.com/.default');
  data.append('client_id', process.env.REACT_APP_CLIENT_ID);
  data.append('TenantID', process.env.REACT_APP_TENANT_ID);

  const url = `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}/oauth2/v2.0/token`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const token = response.data?.access_token;
    console.log('Token:', response,token);
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
  }
};

export const getSiteId = async (token) => {
    const url = `https://graph.microsoft.com/v1.0/sites/${process.env.REACT_APP_TENANT_NAME}.sharepoint.com:/sites/${process.env.REACT_APP_SITE_NAME}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const siteId = response.data.id;
      console.log("Site id",siteId)
      return response.data;
    } catch (error) {
      console.error('Error fetching site info:', error);
      throw error;
    }
};

export const getDriveId = async (token, siteId) => {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const driveId = response.data.value[0].id
      console.log("drive id : ",driveId)
      return driveId
    } catch (error) {
      console.error('Error fetching drives:', error);
      throw error;
    }
};

export const getDriveItems = async (token, driveId) => {
    const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/Questionnaires:/children`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Drive Items : ",response.data.value)
      return response.data.value
    } catch (error) {
      console.error('Error fetching drive items:', error);
      throw error;
    }
  };