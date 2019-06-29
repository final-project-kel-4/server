const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')
<<<<<<< HEAD
const {scrapJobByUrl} = require('../helpers/linkedin-scrapper')
=======
const { scrapJobByUrl } = require('../helpers/linkedin-scrapper')
>>>>>>> progress testing

class JobController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Job.find({});
            res.status(200).json(list)
        }
        catch (err) {
            console.log("ERR - Job.findAll =>\n", err);
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Job.findOne({ _id: id });
            if (data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json("Job not found")
            }
        }
        catch (err) {
            console.log("ERR - Job.findOne =>\n", err);
            res.status(500).json(err)
        }
    }

    static async create(req, res) {

        let newData, linkedinLink = req.body.linkedin
<<<<<<< HEAD
        let created, scrapJobData, cleaned;
        scrapJobData = await scrapJobByUrl(linkedinLink);

        try {
            if(!scrapJobData) {
                throw Error('Error scrapping the job link. Please try again.')
            }
            //init Job model data
            newData = JobController.initJobData(scrapJobData)
            newData.linkedinURL = linkedinLink;
            
            created = await Job.create(newData);

            if(created) {
=======
        let created;

        //TODO: Call job scrapper
        // newData = scrapJobByUrl(linkedinLink)
        newData = { company:
            { name: 'Tokopedia',
              img:
               'https://media.licdn.com/dms/image/C560BAQGBRMCEK3Y6vw/company-logo_100_100/0?e=1570060800&v=beta&t=JcA66pFS4nhKALUTzhnjoI5TuRb0XU7RR_KxA8nZs38',
              address: 'Greater Jakarta Area, Indonesia' },
           jobTitle: 'Software Engineer',
           rawHtml:
            '<div class="description__text description__text--rich"><p>As a software engineer, you will bring solutions that change the lives of millions of users. Here at Tokopedia, you will work with a small team and can switch team or projects depending on business needs. We need people who are willing to learn and always eager to tackle exciting problems at a huge scale </p><strong><p><strong>&nbsp;</strong> </p>Responsibilities</strong><ul><li>Hands on with code in either of GoLang, C, C++, Node.js, Ruby, Python. Multi-programming-lingual. The more the merrier. </li><li>Comfortable working in a *nix environment, using cli. </li><li>Eager to learn new tools, techniques, languages, and technologies. </li><li>Passionate about making a difference to the world. </li><li>Be able to contribute to system architecture and design. </li><li>Be able to debug non-trivial application code. </li><li>Be able to write clear, concise source-code documentation, unit and integration tests. </li><li>Be able to think beyond code to architecture and user experience. </li><li>Be able to communicate and coordinate within a team. </li><li>Build a features, systems. </li><li>Solve technical problems. </li><li>Create scalable back-end. </li></ul><strong><p><strong>&nbsp;</strong> </p>Requirements</strong><ul><li>Prior experience with e-commerce or web application development (REST). </li><li>Contributions to open-source projects (A link to github profile gets extra points). </li><li>Experience with &nbsp;nginx, postgres, redis, aws, git. </li><li>Familiarity with unit testing, integration testing, and test-driven development. </li><li>Experience with HTML5, CSS, JQuery, Bootstrap etc. </li><li>Knowledge of XHTML, Perl, GoLang, PHP. </li><li>Knowledge of SQL / NoSQL. </li><li>Knowledge of Unix/Linux environments.</li></ul></div><ul class="job-criteria__list"><li class="job-criteria__item"><h3 class="job-criteria__subheader">Seniority level</h3><span class="job-criteria__text job-criteria__text--criteria">Mid-Senior level</span></li><li class="job-criteria__item"><h3 class="job-criteria__subheader">Employment type</h3><span class="job-criteria__text job-criteria__text--criteria">Full-time</span></li><li class="job-criteria__item"><h3 class="job-criteria__subheader">Job function</h3><span class="job-criteria__text job-criteria__text--criteria">Information Technology</span><span class="job-criteria__text job-criteria__text--criteria">Engineering</span></li><li class="job-criteria__item"><h3 class="job-criteria__subheader">Industries</h3><span class="job-criteria__text job-criteria__text--criteria">Internet</span><span class="job-criteria__text job-criteria__text--criteria">Information Technology and Services</span></li></ul>',
           rawText:
            'As a software engineer, you will bring solutions that change the lives of millions of users. Here at Tokopedia, you will work with a small team and can switch team or projects depending on business needs. We need people who are willing to learn and always eager to tackle exciting problems at a huge scale   ResponsibilitiesHands on with code in either of GoLang, C, C++, Node.js, Ruby, Python. Multi-programming-lingual. The more the merrier. Comfortable working in a *nix environment, using cli. Eager to learn new tools, techniques, languages, and technologies. Passionate about making a difference to the world. Be able to contribute to system architecture and design. Be able to debug non-trivial application code. Be able to write clear, concise source-code documentation, unit and integration tests. Be able to think beyond code to architecture and user experience. Be able to communicate and coordinate within a team. Build a features, systems. Solve technical problems. Create scalable back-end.   RequirementsPrior experience with e-commerce or web application development (REST). Contributions to open-source projects (A link to github profile gets extra points). Experience with  nginx, postgres, redis, aws, git. Familiarity with unit testing, integration testing, and test-driven development. Experience with HTML5, CSS, JQuery, Bootstrap etc. Knowledge of XHTML, Perl, GoLang, PHP. Knowledge of SQL / NoSQL. Knowledge of Unix/Linux environments.',
           'Short Description':
            [ 'As a software engineer, you will bring solutions that change the lives of millions of users. Here at Tokopedia, you will work with a small team and can switch team or projects depending on business needs. We need people who are willing to learn and always eager to tackle exciting problems at a huge scale' ],
           Responsibilities:
            [ 'Hands on with code in either of GoLang, C, C++, Node.js, Ruby, Python. Multi-programming-lingual. The more the merrier.',
              'Comfortable working in a *nix environment, using cli.',
              'Eager to learn new tools, techniques, languages, and technologies.',
              'Passionate about making a difference to the world.',
              'Be able to contribute to system architecture and design.',
              'Be able to debug non-trivial application code.',
              'Be able to write clear, concise source-code documentation, unit and integration tests.',
              'Be able to think beyond code to architecture and user experience.',
              'Be able to communicate and coordinate within a team.',
              'Build a features, systems.',
              'Solve technical problems.',
              'Create scalable back-end.' ],
           Requirements:
            [ 'Prior experience with e-commerce or web application development (REST).',
              'Contributions to open-source projects (A link to github profile gets extra points).',
              'Experience with  nginx, postgres, redis, aws, git.',
              'Familiarity with unit testing, integration testing, and test-driven development.',
              'Experience with HTML5, CSS, JQuery, Bootstrap etc.',
              'Knowledge of XHTML, Perl, GoLang, PHP.',
              'Knowledge of SQL / NoSQL.',
              'Knowledge of Unix/Linux environments.' ] };

        // process job descriptions (remove stop words, lowercase, duplicate, etc)
        newData.cleanedDescription = TextUtility.cleanInput(newData.rawText)
console.log(req.user);

        try {
            created = await Job.create({...newData, user:req.user._id, linkedinURL:linkedinLink});
            if (created) {
>>>>>>> progress testing
                res.status(201).json(created)
            }
            else {
                throw Error("Error creating data")
            }
        }
        catch (err) {
            console.log("ERR - Job.create =>\n", err);
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Job.findOneAndDelete({ _id: id });
            if (deleted) {
                res.status(201).json(created)
            }
            else {
                throw Error("Invalid ID")
            }
        }
        catch (err) {
            console.log("ERR - Job.delete =>\n", err);
            res.status(500).json(err)
        }
    }

    static initJobData(scrapData) {
        let data = {}
        
        data.title = scrapData.jobTitle
        data.company = scrapData.company
        data.rawHtml = scrapData.rawHtml
        data.originalDescription = scrapData.rawText
        data.cleanDescription = TextUtility.cleanInput(scrapData.rawText);

        return data
    }
}

module.exports = JobController