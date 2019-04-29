# Imitational Modeling

My own nodejs implementation of imitational cycle of time events based on async functions, promises and generators.

The core is time.js.
tick() make one step further in simulation.

The one example implemented:
  "There are 200 cars in transport company. City map is a square with regular grid totally of 10000 square zones. At the beginning all the cars are in garage which is situated in the left bottom square of the map. The control room receives requests from customers (intervals are distributed exponentially with an average of 2 minutes, the destination is determined randomly). The dispatcher sends the first available machine in the warehouse to the call. If there is no free cars the client is put in the queue. The car is loaded with the goods of only one customer and completely unloaded when got to the destination place, and then returned to the warehouse. Loading and unloading of the car takes 10±2 minutes. The trip takes place only on the "horizontal" and "vertical" streets, the time to move to the adjacent square is distributed exponentially with an average of 5 minutes, but not less than 2 minutes. Simulate the work for 8 hours. Determine the average percentage idle time of machines. Determine the parameters of the queue of customers."

# Имитационное моделирование на системном уровне

Моя реализация цикла временных событий имитационного моделирования, основанная на асинхронных функциях, промисах и генераторах (для nodejs).

Ядром программы является модуль time.mjs.
tick() осуществляет один шаг вперед по временной оси симуляции.

Реализованный пример:
  "В транспортной компании N=200 машин. Карта города представляет собой квадрат, разделённый регулярной сеткой на 10000 квадратных зон. В начальный момент времени все машины находятся на складе, расположенном в левом нижнем углу карты. В диспетчерскую поступают запросы от заказчиков (интервалы распределены экспоненциально со средним 2 минуты, место назначения определяется случайным образом). Диспетчер направляет на вызов первую свободную машину, находящуюся на складе. Если свободных машин нет, клиент ставится в очередь. Машина загружается товаром только одного заказчика и полностью разгружается у него, после чего возвращается на склад. Погрузка и разгрузка машины занимают по 10±2 минуты. Поездка совершается только по «горизонтальным» и «вертикальным» улицам, время на перемещение в соседний квадрат распределено экспоненциально со средним 5 минут, но не менее 2-х. Промоделировать работу в течение 8 часов. Определить средние долю времени простоя машин. Определить параметры очереди клиентов."
