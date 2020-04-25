import requests

SOURCE_API_URL = 'http://localhost:8100/'
TARGET_API_URL = 'http://localhost:8101/'


class EventDefinitionChanged(object):
    table_name = 'events_definition_changed'
    source = SOURCE_API_URL
    target = TARGET_API_URL

    def __init__(self):
        pass

    def extract(self):
        data = requests.get(self.source + self.table_name).json()
        for item in data:
            yield item

    def load(self, item):
        url = self.target + 'definitions?id=eq.{}'.format(item['id'])
        del item['id']
        rq = requests.patch(url, data=item)
        print(url, rq.status_code, rq.text)

    def run(self):
        for data in self.extract():
            url = self.target + 'definitions?definition=eq.' + data['old_definition']
            defn_id_json = requests.get(url).json()
            if len(defn_id_json) < 1:
                print('skipping {} as not present in target database.'.format(data['old_definition']))
                continue

            print(defn_id_json)
            defn_id = defn_id_json[0]['id']
            item = {
                "id": defn_id,
                "date_changed": data['change_datetime'],
                "definition": data['new_definition'],
                "definition_language": defn_id_json[0]["definition_language"]
            }
            # trigger should fill events_definition_changed
            print('fixing {} -> {}'.format(data['old_definition'], data['new_definition']))
            print(item)
            self.load(item)



if __name__ == '__main__':
    bot = EventDefinitionChanged()
    bot.run()
