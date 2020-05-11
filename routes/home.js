function Home(Featured, Video){
    return async function(req, res){
        try {

            //get references for featured videos
            let featuredVideos;
            const references = await Featured.find({}).sort({ time: -1 });
            if(references) featuredVideos = [];
        
            //find and push videos by references for featured videos
            references.forEach(async reference => {
                const video = await Video.findById(reference.linked_id)
                featuredVideos.push(video);
            })
        
            //get latest 6 videos from database
            const latest = await Video.find({})
                                    .sort({ time: -1 })
                                    .limit(6);
        
            //render the page
            res.render("index", {
              featured: featuredVideos,
              latest: latest
            });
        
        
          } catch (error) {
            console.error(error)
          }
    }
}

module.exports = Home;