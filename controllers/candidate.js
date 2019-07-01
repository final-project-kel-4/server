const Candidate = require('../models/candidate')
const TextUtility = require('../helpers/textProcessing')
const GoogleNLP = require('./google-nlp')

const dummy = {
    name: 'Dummy 1',
    linkedinURL: "https://www.linkedin.com/in/tyas-kokasih-860ab153/",
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


const dummy2 = {
    name: 'Dummy 2',
    linkedinURL: 'https://www.linkedin.com/in/moussa-boudouh-2b333014/',
    profile: {
        currentPosition: "Senior Cost Engineer chez EDF Energy",
        about: ``,
        workExperience: [`I am responsible for the control and the monitor of the project total expenditure including verifying and checking of invoices and claims from suppliers, vendors and subcontractors to ensure
        that all project expenditures are captured and properly recorded.
        I Provide planning and cost controlling support for all projects which includes variation
        reporting, monitoring of milestone progress to the preparation of customer billing
        processes, etc
        I Perform and manage project activity scheduling and monitoring
        I monitor the WBS with the use of project management system to monitor the status of all purchases, invoicing and delivery up to the closure of the project.
        I Provide cost control and planning advice to the project manager as and when
        required.`,
        `I was responsible for: 
        - the electrical installation of the nuclear plants of Creys-Malville and Bugey 1,
        - the preparation of technical studies, 
        - the technical specifications, 
        - the estimations, 
        - the supervision of contract and suppliers studies`,
        `Subject: modification of an evaporation hall, 
        Cost control, planning, liaison with the different subcontractors, management of 10 people and management of the construction works`
    ],
        recommendations: [``],
        educations: [`Nanyang Technological University
        Bachelor of Electrical and Electronic Engineering`],
    },
}

const dummy3 = {
    name: 'Dummy 3',
    linkedinURL: 'https://www.linkedin.com/in/agnes-k/',
    profile: {
        currentPosition: "HR Consultant, Recruiter - Tech Talents, Asia | Growth and Productivity Hacker | Business Developer | Mother |",
        about: ` recruit senior techno-commercial talents across Asia.

        My professional career started in Warsaw, Poland, where I moved to study from my hometown Grodno in Belarus. Winning grant for 2 faculties in 2 Universities in Warsaw, I could not choose, and I took them both. This way I graduated from Sociology (economics and advertising) and Polish Philology (language for foreigners).
        
        Education and facilitating communities became my lifetime passion. Though my major focus was always placed in the business world. Within 10 years of my career, I spent 5 in Business Development, 2 in Management and 5 in Sales. Exposure to a variety of industries (from energy market, renewable energy, in particular, investment and trading to education and entrepreneurs) provided a solid overview of functioning with and within organizations on all levels.`,
        
        workExperience: [`This service provider is among the best 20 HR software and is a trusted HR Tech partner for 100+ organizations. Soon also in Poland`,
        `Blockchain Zoo is a software company and an association of technology professionals with a magnificent pipeline of various projects, blockchain technology based. During the first year, BCZ has grown from a bunch of enthusiasts into a well-recognized group of companies listed by Gartner. Founders are invited as expert speakers all over the Asia Pacific and featured in Forbes, BBC, CNBC. 
        Key Responsibility: to enable a step up and take a group of companies from Pan Asian to a Global reach.`,
        `Business models evaluation for ASEAN region and market research for: retail electricity market in Singapore, Renewable Energy Sources in Indonesia, Singapore and Philippines.

        Head hunting and requiting for top management positions in the Virtuse Group.
        
        Establishing infrastructure for the Rooftop Solar Development in Philippines.
        
        Obtaining the license of Energy Market Authority of Singapore for Retailer.
        
        Requiting and coordinating subcontractors for marketing purposes: copywriters, designers, web developers.
        
        Participation in events: Renewable Energy (Jakarta, Indonesia), Singaporean International Energy Week (Singapore), Solar Philippines Exhibition (Manila, Philippines) 
        
        Achievements summary: Evaluating potential in various markets in ASEAN region and launching 2 startups – Energy Retail in Singapore, Solar Development in Philippines`
    ],
        recommendations: [`I have had the pleasure of working with Agnes over the last year on building up a pipeline of enterprise clients in Indonesia. Agnes has helped us step away from the traditional lead generation methods and techniques into a more creative, personal and interactive lead generation strategy. In Q1 of 2019 we say an overall increase of more than 100% in qualified leads at Meiro and this was largely due to the strategy put inlace by Agnes and her team.`,
        `We've been working with Agnes for a few months now, and must say we're impressed! An intriguing blend of technical ability and strategic thought, backed by sheer hard work!`,
        `Agnes is very passionate about what she does. I had the pleasure of attending one of her workshops recently where she shared a wealth of knowledge and information. The value added during this course has helped me personally further expand my contacts and exposure. Agnes is truly driven and willing to share and help`
    ],
        educations: [`Collegium Civitas Bachelor's Degree, Sociology`],
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
        newData = initModelData(dummy2)
        newData.user = req.user._id

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

    static async refresh(req, res) {
        let candidate, scrapData

        try {
            // UNCOMMENT lines below once scrapProfile is ready
            //TODO: call scrapProfile and update candidate model
            /* candidate = await Candidate.findOne({_id: req.params.id})
    
            scrapData = await scrapProfile(candidate.linkedinURL)
            scrapData = initModelData(scrapData)
            candidate = await Candidate.findOneAndUpdate({_id: req.params.id}, {profile: scrapData.profile }, {new: true});
    
            if(!candidate) throw Error("Error during Candidate update")

            res.status(200).json(candidate) */
            
            res.status(200).json("dummy refresh")
        }
        catch(err) {
            console.log("ERR - Candidate.update =>\n", err);
            res.status(500).json(err)
        }

    }

}

const initModelData = (rawData) => {
    let newData = {profile: {}}
        
    // newData.name = dummy.name
    newData.name = rawData.name
    newData.linkedinURL = rawData.linkedinLink
    newData.profile.currentPosition = rawData.profile.currentPosition
    newData.profile.about = TextUtility.cleanInput(rawData.profile.about)
    newData.profile.workExperience = rawData.profile.workExperience.map(x => {
        return TextUtility.cleanInput(x)
    })
    newData.profile.recommendations = rawData.profile.recommendations.map(x => {
        return TextUtility.cleanInput(x)
    })
    newData.profile.educations = rawData.profile.educations.map(x => {
        return TextUtility.cleanInput(x)
    })

    /* add entities attribute, which contains same attributes as profile
        entities {
            currentPosition,
            about,
            workExperience,
            recommendations,
            educations
        }
    */
    return newData
}

module.exports = CandidateController