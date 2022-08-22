const CountryModel = require('../Models/Country.Model')
const RelationshipsModel = require('../Models/Relationship.Model')
module.exports = class { 

    constructor() { 
        this.country = new CountryModel()
        this.relationship = new RelationshipsModel()
    }

    Run = async (req, res) => { 
        try {
            this.country.Seed();
            this.relationship.Seed()
            res.json({
                'status': "Ok",
                "message": "Configuration complete!"
            })
        } catch (err) { 
            res.json({
                "status": 'error',
                'message': "Configurations Failed",
                "error":err
            })
        }
    }
}