function HashMap() {
   this.value = [];

   this.isEmpty = function () {
      return this.value.length === 0;
   };

   this.size = function () {
      return this.value.length;
   };

   this.get = function (key) {
      if (key == null) throw new Error("IllegalArgumentException: key is null");
      var pos = binarySearch(this.value, parseInt(key));
      if (pos < 0) return null;
      return this.value[pos].getValue();
   };

   this.put = function (key, val) {
      if (key == null || val == null) throw new Error("IllegalArgumentException: key or value is null");
      key = parseInt(key);
      val = parseInt(val);

      var pos = binarySearch(this.value, key);
      var oldVal = null;

      if (pos >= 0) {
         oldVal = this.value[pos].getValue();
         this.value[pos].setValue(val);
      } else {
         var entry = new Entry(key, val);
         this.value.push(entry);
         mergeSort(this.value);
      }

      return oldVal;
   };

   this.remove = function (key) {
      if (key == null) throw new Error("IllegalArgumentException: key is null");
      key = parseInt(key);

      var pos = binarySearch(this.value, key);
      if (pos < 0) return null;
      var val = this.value[pos].getValue();
      this.value.splice(pos, 1);
      return val;
   };

   this.makeEmpty = function () {
      this.value = [];
   };

   this.contains = function (key) {
      if (key == null) throw new Error("IllegalArgumentException: key is null");
      key = parseInt(key);
      var pos = binarySearch(this.value, key);
      return pos >= 0;
   };

   this.keys = function () {
      return this.value.map(entry => entry.getKey());
   };

   this.toArray = function () {
      return this.value.map(entry => entry.getValue());
   };

   // Funzioni ausiliarie interne
   function mergeSort(a) {
      if (a.length <= 1) return;
      var mid = Math.floor(a.length / 2);
      var left = a.slice(0, mid);
      var right = a.slice(mid);
      mergeSort(left);
      mergeSort(right);
      merge(a, left, right);
   }

   function merge(a, b, c) {
      var i = 0, j = 0, k = 0;
      while (j < b.length && k < c.length) {
         if (b[j].getKey() < c[k].getKey()) {
            a[i++] = b[j++];
         } else {
            a[i++] = c[k++];
         }
      }
      while (j < b.length) a[i++] = b[j++];
      while (k < c.length) a[i++] = c[k++];
   }

   function binarySearch(array, searchElement) {
      var low = 0, high = array.length - 1;
      while (low <= high) {
         var mid = Math.floor((low + high) / 2);
         var midKey = array[mid].getKey();
         if (midKey < searchElement) {
            low = mid + 1;
         } else if (midKey > searchElement) {
            high = mid - 1;
         } else {
            return mid;
         }
      }
      return -1;
   }

   function Entry(k, v) {
      this.key = k;
      this.val = v;

      this.getKey = function () {
         return this.key;
      };

      this.getValue = function () {
         return this.val;
      };

      this.setKey = function (k) {
         this.key = k;
      };

      this.setValue = function (v) {
         this.val = v;
      };

      this.getInfo = function () {
         return "(" + this.key + "," + this.val + ")";
      };
   }
}
