import axios from 'axios';

const api=axios.create({
    dbDNS: "http://localhost:8888"
})

export default api