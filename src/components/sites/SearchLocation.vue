<template>
    <div>
        <h1>Searching: {{ searchTerm }}</h1>
        <h2> {{ properties.rank }} </h2>
    </div>
</template>



<script>
import axios from 'axios'
export default {
    data () {
        return {
            searchTerm: this.$route.params.searchTerm,
            city: '',
            state_code: '',
            properties: [ ]
        }
    },
    methods: {
       queryLocation () {
           var properties = [ ]
            console.log('city: ', this.city)
            console.log('state-code: ', this.state_code)
            const options = {
                method: 'GET',
                url: 'https://rapidapi.p.rapidapi.com/properties/v2/list-for-rent',
                params: {
                    city: this.city,
                    state_code: this.state_code,
                    limit: '20',
                    offset: '0',
                    sort: 'relevance'
                },
                headers: {
                    'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                    'x-rapidapi-host': 'realtor.p.rapidapi.com'
                }
                };axios.request(options).then(function (response) {
                    const newResponse = response.data.properties
                    newResponse.forEach( property => {
                        properties.push(property.rank)
                    })
                    this.properties = properties
                    console.log(response.data)
                }).catch(function (error) {
                    console.error(error);
                });//axios
        },
         queryLocationCodes () {
            const searchTerm = this.searchTerm
            var city = 'unchanged'
            var state_code = 'unchanged'
            //axios
            const options = {
                method: 'GET',
                url: 'https://rapidapi.p.rapidapi.com/locations/auto-complete',
                params: {input: searchTerm},
                headers: {
                    'x-rapidapi-key': '624dc7754bmsh3f19b0e1fbd4882p18e7f1jsn0d9d641d8df8',
                    'x-rapidapi-host': 'realtor.p.rapidapi.com'
                }};
                axios.request(options).then( response => {
                console.log(response.data.autocomplete[0].city);
                console.log(response.data.autocomplete[0].state_code);
                city = response.data.autocomplete[0].city
                state_code = response.data.autocomplete[0].state_code
                this.city = city
                this.state_code = state_code
                console.log(this.city)
                console.log(this.state_code)
                this.queryLocation()
                }).catch(function (error) {
                console.error(error);
            });// axios
        },
    },
    mounted () {
                this.queryLocationCodes()
    }
}
</script>