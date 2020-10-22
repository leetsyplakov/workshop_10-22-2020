function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('API')
      .addItem('Generate', 'getReport')
      .addToUi();
}


function getReport()
{

  var nextPageToken = '';
  var nextPageTokenPlaylist = '';
  var nextPageTokenVideos = '';
  var stringOfVideos = "";
  var headers =  ["Channel", "Video Title", "ID", "Description", "Published At", "View Cont", "Length", "Tags","Thumbnail"];


  // COUNTERS
  var numberOfVideos = 0;
  var rowCount = 2;

  // GOOGLE SHEETS
  var ssId = '[ENTER YOUR GOOGLE SHEET ID]'; // <------------------!!!
  var resultSheetName = '[ENTER RESULT SHEET NAME]';   // <<-------------!!!!
  var menuSheetName = '[ENTER MENU SHEET NAME]'; // <<-------------!!!!
  var menuSheetInputCell = "[ENTER INPUT CELL]"; // <<-------------!!!!
  var ssNew = SpreadsheetApp.openById(ssId);
  var sheet = ssNew.getSheetByName(resultSheetName);
  var channelIdToSearch = ssNew.getSheetByName(menuSheetName).getRange(menuSheetInputCell).getValue();

  sheet.clear();
  sheet.getRange(1, 1, 1, 9).setValues([headers]);

  while(nextPageToken != null)
  {
    try{
      var myChannels = YouTube.Channels.list('contentDetails,snippet,id', {
        id:channelIdToSearch,
        maxResults: 1,
        pageToken: nextPageToken
      });

      nextPageToken = myChannels.nextPageToken;
      for(var i in myChannels.items)
      {
        var channel = myChannels.items[i];
        while(nextPageTokenPlaylist != null)
        {
          var responsePlaylistItems = YouTube.PlaylistItems.list('snippet', {
            playlistId: channel.contentDetails.relatedPlaylists.uploads,
            maxResults:50,
            pageToken:nextPageTokenPlaylist
          });
          Logger.log("Uploads PL: "+channel.contentDetails.relatedPlaylists.uploads)
          nextPageTokenPlaylist = responsePlaylistItems.nextPageToken;
          for(var j =0;j<responsePlaylistItems.items.length;j++)
          {
            stringOfVideos += responsePlaylistItems.items[j].snippet.resourceId.videoId+',';
            numberOfVideos++;
          }
          stringOfVideos = stringOfVideos.slice(0, -1);

          var responseVideo = YouTube.Videos.list('statistics,contentDetails,id,snippet', {
            id:stringOfVideos,
            maxResult:50,
            pageToken:nextPageTokenVideos
          });
          stringOfVideos ="";
          nextPageTokenVideos = responseVideo.nextPageToken
          for(var t = 0; t<responseVideo.items.length;t++)
          {
            sheet.getRange(rowCount, 1).setValue(myChannels.items[i].snippet.title);
            sheet.getRange(rowCount, 2).setValue(responseVideo.items[t].snippet.title);
            sheet.getRange(rowCount, 3).setValue(responseVideo.items[t].id);
            sheet.getRange(rowCount, 4).setValue(responseVideo.items[t].snippet.description);
            var publishedAt = new Date(responseVideo.items[t].snippet.publishedAt);
            var dd = publishedAt.getDate();
            var mm = publishedAt.getMonth() + 1
            var yyyy = publishedAt.getFullYear();
            var adjustedDate = mm+"/"+dd+"/"+yyyy;
            sheet.getRange(rowCount, 5).setValue(adjustedDate);
            sheet.getRange(rowCount, 6).setValue(responseVideo.items[t].statistics.viewCount);
            var duration = "00";
            duration = responseVideo.items[t].contentDetails.duration;
            duration = duration.substr(2);
            sheet.getRange(rowCount, 7).setValue(duration);
            var tags = "";
            try{
              if(responseVideo.items[t].snippet.tags.length)
              {
                for (q = 0; q < responseVideo.items[t].snippet.tags.length; q++)
                {
                  if(q!=(responseVideo.items[t].snippet.tags.length-1)){
                    tags+=responseVideo.items[t].snippet.tags[q]+", ";}
                  else{
                    tags+=responseVideo.items[t].snippet.tags[q]
                  }
                }
              }
            }catch(er){
              Logger.log("Error: " + er);
            }
            sheet.getRange(rowCount, 8).setValue(tags);
            sheet.getRange(rowCount, 9).setValue("http://img.youtube.com/vi/"+responseVideo.items[t].id+"/maxresdefault.jpg");
            rowCount++;
          }
        }
      }
    }catch(e){
      Logger.log("Error: " + e);
    }
  }
}
