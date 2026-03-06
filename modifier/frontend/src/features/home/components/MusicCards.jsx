import {useContext} from "react";
import {MusicContext} from "../MusicContext";
import {Heart,Play} from "lucide-react";

import "../style/cards.scss";

const MusicCards = ({songs,title})=>{

const {addFavorite} = useContext(MusicContext);

return(

<div className="music-section">

<h3>{title}</h3>

<div className="music-grid">

{songs?.map(song=>(
<div key={song._id} className="music-card">

<img src={song.posterUrl}/>

<div className="meta">
<p>{song.title}</p>
<span>{song.mood}</span>
</div>

<div className="actions">

<button>
<Play size={18}/>
</button>

<button onClick={()=>addFavorite(song)}>
<Heart size={18}/>
</button>

</div>

</div>
))}

</div>

</div>

);

};

export default MusicCards;