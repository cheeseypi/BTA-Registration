import { v4 as uuidv4 } from 'uuid';

function PlayerVerificationException(message){
    return new Error(message);
}
PlayerVerificationException.prototype = Object.create(Error.prototype);
function PlayerRetrievalException(message){
    return new Error(message);
}
PlayerRetrievalException.prototype = Object.create(Error.prototype);

var players = [];

export function VerifyPlayerObject(player){
    let flag = true;
    flag = flag && player.name;
    flag = flag && player.times;
    return flag;
}
export function SavePlayer(player){
    if(!VerifyPlayerObject(player)){
        throw new PlayerVerificationException('Unable to validate player object')
    }
    if(SearchPlayerByName(player.name).length > 0){
        throw new Error('A player with that name is already registered.')
    }
    player.id = uuidv4()
    players.push({...player});
    return {...player};
}
export function RetrievePlayerById(id){
    let search = players.filter(x => x.id == id);
    if(search.length != 1){
        throw new PlayerRetrievalException("Could not find unique player with given id");
    }
    return {...search[0]};
}
export function SearchPlayerByName(name){
    let search = players.filter(x => x.name.toLowerCase() == name.toLowerCase());
    return [...search];
}
export function UpdatePlayer(id, player){
    throw new Error('Not Implemented for basic list');
}
export function DeletePlayer(id){
    throw new Error('Not Implemented for basic list');
}
export function RegistrationBoard(){
    return [...players];
}