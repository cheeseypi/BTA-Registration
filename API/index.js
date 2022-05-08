//const requests = require('requests');
import got from 'got';
import express from 'express';
import fs from 'fs';
const app = express()
const port = process.env.PORT || 3000

let categories = JSON.parse(fs.readFileSync('categories.json'));
/*
What do I need from this API?
- Get user data from SRC
- Store participant entries
- Calculate scores for participants
- Send back score for individual participants
- Send back unified board for placements of all participants

API REFERENCE

/PBs/<userId> : GET
    Retrieves PBs from SRC for a user matching the given userid

/Participant : POST
  Add a participant to BTA, requires `name`, `times`, `questionnaire`. Returns participant object w/ participant ID & score
    /Participant/<participantId> : GET
    /Participant/<participantName> : GET
      Retrieve participant object
    /Participant/<participantId> : PUT, DELETE
    /Participant/<participantName> : PUT, DELETE
      Requires admin API token; Modify or remove participants

/RegistrationBoard : GET
  Retrieves all BTA participants with their preliminary placements
*/

function getPB(runList){
    let pb = -1
    for(let run of runList){
        if(pb < 0 || run.times.primary_t < pb){
            pb = run.times.primary_t;
        }
    }
    return pb;
}
function pprintSeconds(totalSeconds){
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);
    return minutes+"m"+seconds+"s"+milliseconds+"ms";
}

app.get('/PBs/:userId', async (req, res) => {
    let srcUserName = req.params.userId;
    let userList = await got.get("https://www.speedrun.com/api/v1/users?name="+srcUserName).json();
    let users = userList.data.filter(x => x.names.international.toLowerCase() === srcUserName.toLowerCase());
    if(users.length > 0) {
        let user = users[0];
        let userId = user.id;
        let runs = await got.get("https://www.speedrun.com/api/v1/runs?user="+userId+"&game=o1y9j9v6&status=verified").json();
        let runList = runs.data;
        while(runs.pagination.links.some(x => x.rel === "next")){
            let nextLink = runs.pagination.links.filter(x => x.rel === "next")[0]
            runs = await got.get(nextLink.uri).json();
            runList.push(...runs.data);
        }
        let finalRet = {}
        for(let cat of categories.categories){
            let pb = getPB(runList.filter(x => x.category === cat.id));
            finalRet[cat.id] = {"name": cat.name, "time": pb, "humanReadable": pprintSeconds(pb)};
        }
        for(let level of categories.levels){
            finalRet[level.id] = {"name": level.name}
            for(let cat of level.categories){
                let pb = getPB(runList.filter(x => x.level === level.id && x.category === cat.id));
                finalRet[level.id][cat.id] = {"name": cat.name, "time": pb, "humanReadable": pprintSeconds(pb)};
            }
        }
        res.json(finalRet)
    }
    else{
        res.statusCode(404).send("Unable to find user in SRC, please make sure you haven't entered a typo");
    }
})


app.post('/Participant', (req, res) => {
})
app.get('/Participant/:participantIdentifier', (req, res) => {
})

app.put('/Participant/:participantIdentifier', (req, res) => {
})
app.delete('/Participant/:participantIdentifier', (req, res) => {
})


app.get('/RegistrationBoard', (req, res) => {
})

app.listen(port, "0.0.0.0", () => {
    //requests("https://www.speedrun.com/api/v1/games/o1y9j9v6/levels").on('data', (chunk) => {console.log(chunk)})
    console.log(`BTA API is up and running on port ${port}`);
})