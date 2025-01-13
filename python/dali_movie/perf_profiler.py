import time

class Perf():
    def __init__(self, name):
        self.name = name
        self.start_time = time.time()

    def finish(self):
        end_time = time.time()
        execution_time = end_time - self.start_time
        #print(f"Execution Time {self.name} : {execution_time:.6f} seconds")
