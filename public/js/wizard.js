var app = new Vue({
    el: "#app",
    data: {
        selectedItem: '',
        items: [],
        makes: [],
        selectedYear: {},
        years: [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
        selectedMake: '',
        models: [],
        selectedModel: '',
        keyTypes: [],
        selectedKeyType: '',
        limit: 0,
        features:[],
        selectedRsType: '',
        selectedRemoteType: '',
        stage: 'make',
        stages: ['make','model', 'year', 'options']

    },
    computed: {
        selectedOptions: function(){
            var self = this;
            return this.items.filter(function(item){
                if(self.selectedRemoteType && self.selectedRsType) {
                    return item.remote.name == self.selectedRemoteType && item.rsType == self.selectedRsType 
                }
                if(self.selectedRemoteType) return item.remote.name == self.selectedRemoteType ;
                if(self.selectedRsType) return item.rsType == self.selectedRsType ;
                return true
            })
        }
    },
    methods: {
        startOver: function(){
            var self = this;
            self.selctedMake = '';
            self.selectedModel = '';
            self.selectedYear = {};
            self.items = [];
            self.stage = 'make'
        },        
        selectMake:function(){
            var self = this;
            self.selectedModel = '';
            self.selectedYear = {};
            self.items = [];

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
                        'make': self.selectedMake
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
            
            self.selectedYear = {};
            self.items = [];

            if(self.selectedModel.length <= 0){
                alert('Please select a model to continue');
                return false;
            } 
            $.ajax({
                url: '/products/findYears',
                method: 'POST',
                data:{  
                    distinct: '',
                    query:{
                        'make': self.selectedMake, 
                        model: self.selectedModel
                    }
                },
                success: function (d) {
                    self.years = d.results;
                    self.stage = 'year';
                },
                error: function (e) {
                    console.log(e);
                }

            })
        },
        selectYear: function(){
            var self = this;
            if(self.selectedYear.length <= 0){
                alert('Please select a year to continue');
                return false;
            } 

            $.ajax({
                url: '/products/findItems',
                method: 'POST',
                data:{
                    populate: 'remote',
                    query: {
                        make: self.selectedMake,
                        model: self.selectedModel,
                        startYear: self.selectedYear._id.startYear,
                        endYear: self.selectedYear._id.endYear
                    }
                },
                success: function (d) {
                    self.items = d.results;
                    self.features = {
                        rsType: self.getUnique(d.results, 'rsType'),
                        remoteType: self.getUnique(d.results, 'remote.name')
                    }
                    self.stage = 'options'
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        getValue(st, obj) {
            return st.replace(/\[([^\]]+)]/g, '.$1').split('.').reduce(function(o, p) { 
                return o[p];
            }, obj);
        },
        getUnique: function (arrOfObj, property) {
            var unique = {};
            var distinct = [];
            for (var i in arrOfObj) {
                var val = this.getValue(property, arrOfObj[i]);
                if(distinct.indexOf(val) == -1){
                    distinct.push(val)
                };
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
