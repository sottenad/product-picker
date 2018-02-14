var app = new Vue({
    el: "#app",
    data: {
        items: [],
        makes: [],
        selectedYear: '',
        years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
        selectedMake: '',
        models: [],
        selectedModel: '',
        keyTypes: [],
        selectedKeyType: '',
        limit: 0,
        selectedOptions: [],
        
        stage: 'year',
        stages: ['year','make','model', 'options']

    },
    computed: {

    },
    methods: {

        selectYear: function(){
            var self = this;

            self.selectedMake = '';
            self.selectedModel = '';
            self.items = [];

            if(self.selectedYear.length <= 0){
                alert('Please select a year to continue');
                return false;
            } 

            $.ajax({
                url: '/products/find',
                method: 'POST',
                data:{
                    distinct: 'make', 
                    query: {
                        startYear: { $lte: self.selectedYear},
                        endYear: { $gte: self.selectedYear}
                    }
                },
                success: function (d) {
                    self.makes = d.results;
                    self.stage = 'make'
                },
                error: function (e) {
                    console.log(e);
                }

            })
        },
        selectMake:function(){
            
            var self = this;

            self.selectedModel = '';
            self.items = [];

            if(self.selectedMake.length <= 0){
                alert('Please select a make to continue');
                return false;
            } 

            $.ajax({
                url: '/products/find',
                method: 'POST',
                data:{
                    distinct:'model', 
                    query:{
                        'make': self.selectedMake,
                        startYear: { $lte: self.selectedYear},
                        endYear: { $gte: self.selectedYear}
                    }
                },
                success: function (d) {
                    self.models = d.results;
                    self.stage = 'model';
                },
                error: function (e) {
                    console.log(e);
                }

            })
        },
        selectModel:function(){
            var self = this;
            
            self.items = [];

            if(self.selectedModel.length <= 0){
                alert('Please select a model to continue');
                return false;
            } 
            $.ajax({
                url: '/products/find',
                method: 'POST',
                data:{  
                    year: self.selectedYear, 
                    query:{
                        'make': self.selectedMake, 
                        model: self.selectedModel,
                        startYear: { $lte: self.selectedYear},
                        endYear: { $gte: self.selectedYear}
                    }
                },
                success: function (d) {
                    self.items = d.results;
                    self.stage = 'options';
                },
                error: function (e) {
                    console.log(e);
                }

            })
        },
        getUnique: function (arrOfObj, property) {
            var unique = {};
            var distinct = [];
            for (var i in arrOfObj) {
                if (typeof (unique[arrOfObj[i][property]]) == "undefined") {
                    distinct.push(arrOfObj[i][property]);
                }
                unique[arrOfObj[i][property]] = 0;
            }
            distinct = distinct.filter(function (n) { return n != undefined });
            return distinct.sort();
        },
        getMakes: function () {
            var self = this;
            $.ajax({
                url: '/products/distinct/make',
                method: 'GET',
                success: function (data) {
                    self.makes = data;
                },
                error: function (e) {
                    console.log(e);
                }

            })
        },
        
    },
    created: function () {
        this.limit = 500;
        this.getMakes()
    }

})

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
