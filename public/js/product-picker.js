var app = new Vue({
    el: "#app",
    data: {
        items: [],
        ticks: 0,
        makes: [],
        make: '',
        models: [],
        model: '',
        keyTypes: [],
        keyType: '',
        selectedYear: 0,
        startYears: [],
        startYear: '',
        endYears: [],
        endYear: '',
        yearRange: [],
        rsTypes: [],
        rsType: '',
        activeRemotesFobs: [],
        activeRemotesFob: '',
        partNumbers: [],
        partNumber: '',
        costs: [],
        cost: '',
        currentFilters: [],
        limit: 0,
    },
    computed: {

    },
    methods: {
        clearAllFilters: function(){
            this.make = '';
            this.makes = [];
            this.model = '';
            this.models = [];
            this.keyType = '';
            this.keyTypes = [];
            this.selectedYear = '';
            this.startYear = '';
            this.startYears = [];
            this.endYear = '';
            this.endYears = [];
            this.rsType = '';
            this.rsTypes = [];
            this.activeRemotesFob = '';
            this.activeRemotesFobs = [];
            this.partNumber = '';  
            this.partNumbers = [];
            this.cost = '';
            this.costs = [];
            this.currentFilters = [];
        },
        clearFilter: function (term) {
            //Make is special
            if(term === 'make'){
                this.clearAllFilters();
            }else{
                this.currentFilters.splice(this.currentFilters.indexOf(term, 1));
            }
            this[term] = '';
            this.getItems();
        },
        calculateYearRange: function () {
            var beginning = this.startYears[0];
            var end = this.endYears[this.endYears.length - 1];
            var arr = [];
            for (var i = beginning; i < end; i++) {
                arr.push(i);
            }
            this.yearRange = arr;
        },
        setFilter: function (model) {
            if (this.currentFilters.indexOf(model) == -1) {
                this.currentFilters.push(model);
            }
            this.getItems();
        },
        getItems: function () {
            var csrftoken = $('meta[name=csrf-token]').attr("content");
            var self = this;
            if (Object.keys(self.buildQuery()).length !== 0) {
                $.ajax({
                    url: '/products/find',
                    method: 'POST',
                    headers: { "HTTP_X_CSRF_TOKEN": csrftoken },
                    data: { query: self.buildQuery(), limit: self.limit },
                    success: function (res) {
                        var data = res.products;

                        if (self.currentFilters.indexOf('make') == -1) self.makes = self.getUnique(data, 'make');
                        if (self.currentFilters.indexOf('model') == -1) self.models = self.getUnique(data, 'model');
                        if (self.currentFilters.indexOf('keyType') == -1) self.keyTypes = self.getUnique(data, 'keyType');
                        if (self.currentFilters.indexOf('startYear') == -1) self.startYears = self.getUnique(data, 'startYear');
                        if (self.currentFilters.indexOf('endYear') == -1) self.endYears = self.getUnique(data, 'endYear');
                        if (self.currentFilters.indexOf('rsType') == -1) self.rsTypes = self.getUnique(data, 'rsType');
                        if (self.currentFilters.indexOf('activeRemotesFobs') == -1) self.activeRemotesFobs = self.getUnique(data, 'activeRemotesFobs');
                        if (self.currentFilters.indexOf('make') == -1) self.partNumbers = self.getUnique(data, 'partNumber');
                        if (self.currentFilters.indexOf('partNumber') == -1) self.costs = self.getUnique(data, 'cost');
                        self.calculateYearRange();
                        self.ticks = res.ticks;
                        self.items = data;

                    },
                    error: function (e) {
                        rej(e)
                    }

                })
            }else{
                self.make = '';
                self.getMakes();
                self.items = [];
            }

        },
        buildQuery: function () {
            var self = this;
            var q = {};
            var columns = [
                { key: 'make', value: self.make },
                { key: 'model', value: self.model },
                { key: 'keyType', value: self.keyType },
                { key: 'rsType', value: self.rsType },
                { key: 'activeRemotesFobs', value: self.activeRemotesFob },
                { key: 'partNumber', value: self.partNumber },
                { key: 'cost', value: self.cost }
            ];
            columns.forEach(function (col) {
                if (col.value.length > 0 && col.value != '---') {
                    if (isNumeric(col.value)) {
                        q[col.key] = parseInt(col.value, 10);
                    } else {
                        q[col.key] = col.value;
                    }
                }
            });
            //Special case for year range
            if (self.selectedYear > 0) {
                q.startYear = { $lte: self.selectedYear }
                q.endYear = { $gte: self.selectedYear }
            }

            //Add Limit


            return q;
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
        getResults: function () {

        }
    },
    created: function () {
        this.limit = 500;
        this.getMakes()
    }

})

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
