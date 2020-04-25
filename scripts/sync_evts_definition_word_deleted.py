import requests

SOURCE_API_URL = 'http://localhost:8100/'
TARGET_API_URL = 'http://localhost:8101/'

"""

"""

class EventDefinitionWordDeleted(object):
    table_name = 'events_rel_definition_word_deleted'
    source = SOURCE_API_URL
    target = TARGET_API_URL

    def __init__(self):
        pass

    def extract(self):
        data = requests.get(self.source + 'vw_' + self.table_name).json()
        for item in data:
            yield item

    def load(self, item):
        url = self.target + 'dictionary?word=eq.{}&definition=eq.{}'.format(item['word'], item['definition'])
        rq = requests.delete(url)
        print(rq.status_code, rq.text)

    def run(self):
        for data in self.extract():
            url = self.target + 'word?word=eq.' + data['word'] + '&select=id'
            word_id_json = requests.get(url).json()
            word_id = word_id_json[0]['id']

            url = self.target + 'definitions?definition=eq.' + data['definition'] + '&select=id'
            defn_id_json = requests.get(url).json()
            defn_id = defn_id_json[0]['id']

            item = {
                "definition": defn_id,
                "word": word_id,
                "comment": "imported",
                "date_changed": data["date_changed"]
            }
            print(item)
            self.load(item)



if __name__ == '__main__':
    bot = EventDefinitionWordDeleted()
    bot.run()
