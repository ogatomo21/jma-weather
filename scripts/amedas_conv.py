import json
import requests

# 設定
URL = "https://www.jma.go.jp/bosai/amedas/const/amedastable.json"
SAVE_FILENAME = "amedas_conv.json"

def main():
    try:
        # 1. データの取得
        print(f"Fetching data from {URL}...")
        response = requests.get(URL)
        data = response.json()

        # 2. データの変換
        # { "ID": "漢字（カナ）" } の形式に加工
        transformed_data = {
            key: f"{val['kjName']}（{val['knName']}）" 
            for key, val in data.items()
        }

        # 3. ファイルへの保存
        with open(SAVE_FILENAME, 'w', encoding='utf-8') as f:
            json.dump(transformed_data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully saved to {SAVE_FILENAME}")

    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    main()
