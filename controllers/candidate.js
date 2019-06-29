const Candidate = require('../models/candidate')
const TextUtility = require('../helpers/textProcessing')

const dummy = {
    name: 'Tyas Kokasih',
    // linkedinURL: "https://www.linkedin.com/in/tyas-kokasih-860ab153/",
    profile: {
        currentPosition: "Software Engineer at Gemalto",
        about: `Software engineer with experience in Eclipse RCP framework (Java) and test automation in HP QTP / UFT. A passionate and fast learner. Focused mainly in managing information complexity.

        A team player and loves to be part to build knowledge-sharing culture. Interested in software development and management process as one form of information complexity. Also interested in general business strategy and administration, economy and public policy for the same reason.`,
        workExperience: [`Part of scrum team to maintain a suite of internal perso modelling applications built on top of Eclipse RCP framework (Java).
        * Data Personalization modelling (Personalization data, e.g. cryptographic keys, loaded into SIM card, IoT connectivity module, eSIM, etc.)
        * Graphical Personalization modelling (SIM card, SMD)
        * Logistic label modelling and printing (box labelling, packing list/delivery note, shipping manifest)
        
        Additional responsibilities:
        * University Relation Ambassador for NTU (2018 - present)
        * Configuration Management Officer for MKS Source/Integrity, Mercurial/Git/RhodeCode
        * Internal trainer for HP QTP / UFT - HP QC (ends 2018 H1)
        
        Framework: OSGi, Eclipse RCP, JFace, SWT, AWT
        Build: Ant+PDE, Maven+Tycho, Jenkins pipeline, NSIS
        SCM (admin+support): MKS Source, Mercurial/Git+RhodeCode
        Issue Tracker (admin+support): MKS Integrity, Redmine, JIRA
        Others: XML, XSL, XSL-FO, XSD, Python, Groovy, Visual Laser Marker`,
        `Create, update, execute and automate tests with HP QC - QTP / UFT 
        * Validation software development artifact from requirement to documentation`
    ],
        recommendations: [``],
        educations: [`Nanyang Technological University
        Bachelor of Science, Physics`],
    },
}


class CandidateController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Candidate.find({});
            res.status(200).json(list)
        }
        catch(err) {
            console.log("ERR - Candidate.findAll =>\n", err);
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Candidate.findOne({_id: id});
            if(data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json("Candidate not found")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.findOne =>\n", err);
            res.status(500).json(err)
        }
    }
    
    static async create(req, res) {
        let newData, linkedinLink = req.body.linkedin
        let created;

        /**
         * property profile of Candidate must have following attributes:
            currentPosition: "",
            about: "",
            workExperience: ["", ""],
            recommendations: ["", ""]
            educations: ["", ""] (optional params)
        */

        //preprocess DUMMY data
        newData = {profile: {}}
        newData.name = dummy.name
        newData.linkedinURL = linkedinLink
        newData.profile.about = TextUtility.cleanInput(dummy.profile.about)
        newData.profile.workExperience = dummy.profile.workExperience.map(x => {
            return TextUtility.cleanInput(x)
        })
        newData.profile.recommendations = dummy.profile.recommendations.map(x => {
            return TextUtility.cleanInput(x)
        })
        newData.profile.educations = dummy.profile.educations.map(x => {
            return TextUtility.cleanInput(x)
        })

        try {
            created = await Candidate.create(newData);
            if(created) {
                res.status(201).json(created)
            }
            else {
                throw Error("Error creating data")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.create =>\n", err);
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Candidate.findOneAndDelete({_id: id});
            if(deleted) {
                res.status(201).json(created)
            }
            else {
                throw Error("Invalid ID")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.delete =>\n", err);
            res.status(500).json(err)
        }
    }
}

module.exports = CandidateController