from config import Settings


def upload_file_to_s3(file_path, file_name, bucket=Settings.S3_BUCKET_MAIN):
    if not Settings.UPLOAD_2_S3:
        return
