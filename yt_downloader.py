import os
import csv

# pip3 install --upgrade youtube_dl
# pip3 install --upgrade ffmpeg


def main():
    #TRY-CATCH Block, to catch errors
    try:
        csv_data = None                                             # List to store the video ids
        with open("lists/new_list.csv") as fp:                      # Open the CSV file
            reader = csv.reader(fp, delimiter=",", quotechar='"')   # Set up the reader
            next(reader, None)                                      # Skip the headers
            csv_data = [row[0] for row in reader]                   # Read each CSV row to the list

        for video_id in csv_data:                                   # Iterrate through the list
            print(f"Downloading {video_id}")                        # Print out the video id from the list
            '''
            Calling YouTube-dl using os.system
                youtube-dl
                https://www.youtube.com/watch?v=[PASSIGN VIDEO ID]
                --format 'bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio/best'
                --merge-output-format mp4
            '''
            os.system(
                f"youtube-dl https://www.youtube.com/watch?v={video_id} --format 'bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio/best' --merge-output-format mp4")

    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
