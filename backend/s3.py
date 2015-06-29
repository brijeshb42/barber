import os

import boto

from config import Settings

IMG_DIR = "images"
IMG_DIR_ABS = os.path.join(
    os.path.dirname(
        os.path.dirname(os.path.realpath(__file__)),
    ),
    IMG_DIR
)


def upload_file_to_s3(
        img_buffer,
        file_name,
        extension,
        bucket=Settings.S3_BUCKET_MAIN):
    if not Settings.UPLOAD_2_S3:
        file_path = os.path.join(IMG_DIR_ABS, file_name)
        with open(file_path, "wb") as img_file:
            img_file.write(img_buffer.getvalue())
        return
    conn = boto.connect_s3(Settings.S3_ACCESS_KEY, Settings.S3_SECRET)
    buck = conn.get_bucket(bucket)
    if bucket == Settings.S3_BUCKET_MACHINE:
        img_key = buck.new_key("images/"+file_name)
    else:
        img_key = buck.new_key(file_name)
    img_key.set_contents_from_string(
        img_buffer.getvalue(),
        headers={"Content-Type": "image/"+extension.lower()})
    img_key.set_acl('public-read')
    img_key.generate_url(expires_in=0, query_auth=False)

