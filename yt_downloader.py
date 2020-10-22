import os
import csv

# pip3 install --upgrade youtube_dl
# pip3 install --upgrade ffmpeg


def download(video_id):
    base_url = "https://www.youtube.com/watch?v="
    dfolder_path = ""
    dl_url = base_url + video_id
    print(dl_url)
    os.system(
        f"youtube-dl https://www.youtube.com/watch?v={video_id} --format 'bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio/best' --merge-output-format mp4")


def main():
    try:
        csv_data = None
        with open("lists/new_list.csv") as fp:

            reader = csv.reader(fp, delimiter=",", quotechar='"')
            next(reader, None)  # skip the headers
            csv_data = [row[0] for row in reader]

        for i in csv_data:
            video_id = i
            print(video_id)
            download(i)

    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
