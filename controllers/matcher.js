const axios = require('axios')
const stringSimilarity = require('string-similarity');
const sw = require('stopword')

class Matcher {
    static compareWithStopWord() {
        let banding1 = ` User experience is about feelings. It’s about how to make our users feeling good, happy, and satisfied when they use our products. Your job as a Senior UX Designer is to give a world-class experience for Tokopedia users. You have main responsibilities to conduct the user and/or evaluation research, do a lot of sketching, and create wireframes that have high usability. Description Understand basic design process: research, ideation, user journey. Collaborate and give advise to UI Designers, UX Engineers, and software engineers on a technical perspective from initial product design process. Collaborate with Product Owners to understand product vision and align the work task. Share ideas with Product Owners and business team to solve user-related problems. Provide clear user flow and wireframe. Build a prototype and do usability testing to solve user problems. Follow design system guidelines. Explore best practice approach to execute comprehensive documentation. Maintain design backlog with Product Development Team (Designers, Engineers and Product Owners). Mentor and coach junior team member to ensure the best design implementation. Proactively improve and develop new process/system with a good balance between new trends and product requirements. As Product Design Evangelist to create awareness about user-centred design and design thinking across multiple divisions. Being a consultant for other UX Designers in at least 3 tribes. Requirements Excellent understanding of the design process and principles. A user-centred approach to design solutions. Good UX documentation: flow, wireframe, and prototype. Able to consider the whole picture while working through details. The portfolio of previous design projects is a must. Excellent understanding the connection between research, prototyping, and wireframing through the design process. Minimum 3 years experience as UX Designer or similar roles. Demonstrate the ability to use UX tools such as Sketch, Invision, etc. Up-to-date knowledge about UX trends. Communicate design ideas and collaborate with cross-functional teams or stakeholders. Conduct in-person user test to observe ones behaviour and extract the essence of ones thought into wire-frame and better flow Experience in presentation and mentoring is a must.  Define the baseline for an ideal workflow. Being a design evangelist. Being an integral role in product management and business strategy. Able to conduct a design sprint. Fluent in writing and speaking in English.`
        let banding2 = ` Senior UX Engineer at Tokopedia Jabodetabek , Indonesia Lihat informasi kontak 500+ koneksi Experienced Frontend Developer with a demonstrated history of working in the internet industry. Strong engineering professional skilled in SQL, Cascading Style Sheets (CSS), PHP, JavaScript, and jQuer Senior UX Engineer Senior Frontend Developer  Frontend Developer`

        banding1 = banding1.replace(/[^a-zA-Z0-9 ]/g, "");
        banding2 = banding2.replace(/[^a-zA-Z0-9 ]/g, "");

        banding1 = banding1.split(' ')
        banding2 = banding2.split(' ')

        //REMOVE STOP WORD
        banding1 = sw.removeStopwords(banding1)
        banding2 = sw.removeStopwords(banding2)

        banding1 = banding1.join(' ')
        banding2 = banding2.join(' ')

        console.log('banding1 :',banding1)
        console.lgo('banding2 :',banding2);

        var similarity = stringSimilarity.compareTwoStrings(banding1, banding2); 

        console.log(similarity);
    }

    static async rankCandidates(req, res) {
        let job = req.body.job
        let candidates = req.body.candidates
        let rank

        try {
            rank = stringSimilarity.findBestMatch(job, candidates);
            if(!rank) {
                rank = []
            }

            res.status(200).json(rank)
        }
        catch(err) {
            console.log("Ranking error: ", err);
            res.status(500).json(err)
        }
    }
}

module.exports = Matcher