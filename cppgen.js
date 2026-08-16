/**
 * AniKode C++20 Transpiling Code Generator (cppgen.js)
 * 
 * Translates AniKode AST into clean, high-performance C++20 standard code
 * for native CPU execution with zero garbage collection overhead.
 */

class CppCodeGenerator {
  constructor() {
    this.scopes = [new Set()];
    this.currentFunctionName = null;
    this.functionDeclarations = [];
  }

  pushScope() {
    this.scopes.push(new Set());
  }

  popScope() {
    this.scopes.pop();
  }

  isDeclared(name) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        return true;
      }
    }
    return false;
  }

  declare(name) {
    this.scopes[this.scopes.length - 1].add(name);
  }

  // Generates the standard C++ runtime header
  getRuntimeHeader() {
    return `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <cmath>
#include <algorithm>
#include <random>
#include <exception>
#include <fstream>

extern int __anikode_line;

class AniKodeError : public std::exception {
public:
    std::string message;
    std::string type;
    int line;
    std::string file;

    AniKodeError(const std::string& msg, const std::string& t, int l, const std::string& f = "main.kode")
        : message(msg), type(t), line(l), file(f) {}

    const char* what() const noexcept override {
        return message.c_str();
    }
};

class Value {
public:
    enum Type { INT, FLOAT, STRING, BOOL, VECTOR, NIL, MAP } type;
    long long intVal;
    double floatVal;
    std::string strVal;
    bool boolVal;
    std::vector<Value> vecVal;
    std::map<std::string, Value> mapVal;

    Value() : type(NIL), intVal(0), floatVal(0.0), boolVal(false) {}
    Value(long long v) : type(INT), intVal(v), floatVal((double)v), boolVal(v != 0) {}
    Value(int v) : type(INT), intVal(v), floatVal((double)v), boolVal(v != 0) {}
    Value(double v) : type(FLOAT), intVal((long long)v), floatVal(v), boolVal(v != 0.0) {}
    Value(const std::string& v) : type(STRING), intVal(0), floatVal(0.0), strVal(v), boolVal(!v.empty()) {}
    Value(const char* v) : type(STRING), intVal(0), floatVal(0.0), strVal(v), boolVal(v[0] != '\\0') {}
    Value(bool v) : type(BOOL), intVal(v ? 1 : 0), floatVal(v ? 1.0 : 0.0), boolVal(v) {}
    Value(const std::vector<Value>& v) : type(VECTOR), intVal(0), floatVal(0.0), boolVal(!v.empty()), vecVal(v) {}
    Value(const std::map<std::string, Value>& m) : type(MAP), intVal(0), floatVal(0.0), boolVal(!m.empty()), mapVal(m) {}

    static Value makeError(const AniKodeError& e) {
        Value val;
        val.type = MAP;
        val.mapVal["message"] = Value(e.message);
        val.mapVal["type"] = Value(e.type);
        val.mapVal["line"] = Value((long long)e.line);
        val.mapVal["file"] = Value(e.file);
        return val;
    }

    std::string toString() const {
        if (type == NIL) return "null";
        if (type == INT) return std::to_string(intVal);
        if (type == FLOAT) {
            std::ostringstream ss;
            ss << floatVal;
            return ss.str();
        }
        if (type == STRING) return strVal;
        if (type == BOOL) return boolVal ? "true" : "false";
        if (type == VECTOR) {
            std::string res = "[";
            for (size_t i = 0; i < vecVal.size(); ++i) {
                res += vecVal[i].toString();
                if (i + 1 < vecVal.size()) res += ", ";
            }
            res += "]";
            return res;
        }
        if (type == MAP) {
            std::string res = "{";
            size_t i = 0;
            for (auto const& [key, val] : mapVal) {
                res += "\\"" + key + "\\": " + val.toString();
                if (++i < mapVal.size()) res += ", ";
            }
            res += "}";
            return res;
        }
        return "";
    }

    double toDouble() const {
        if (type == INT) return (double)intVal;
        if (type == FLOAT) return floatVal;
        if (type == STRING) {
            try { return std::stod(strVal); } catch(...) { return 0.0; }
        }
        if (type == BOOL) return boolVal ? 1.0 : 0.0;
        return 0.0;
    }

    long long toInt() const {
        if (type == INT) return intVal;
        if (type == FLOAT) return (long long)floatVal;
        if (type == STRING) {
            try { return std::stoll(strVal); } catch(...) { return 0; }
        }
        if (type == BOOL) return intVal;
        return 0;
    }

    operator bool() const {
        return boolVal;
    }

    // Index lookup operators for vector and maps
    Value& operator[](const Value& key) {
        if (type == MAP) {
            return mapVal[key.toString()];
        }
        if (type == VECTOR) {
            int idx = (int)key.toInt();
            if (idx < 0 || idx >= (int)vecVal.size()) {
                throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
            }
            return vecVal[idx];
        }
        if (type == STRING) {
            static Value charVal;
            int idx = (int)key.toInt();
            if (idx < 0 || idx >= (int)strVal.length()) {
                throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
            }
            charVal = Value(std::string(1, strVal[idx]));
            return charVal;
        }
        throw AniKodeError("Cannot index into non-collection type", "TypeError", __anikode_line);
    }
    Value operator[](const Value& key) const {
        if (type == MAP) {
            auto it = mapVal.find(key.toString());
            if (it != mapVal.end()) return it->second;
            return Value();
        }
        if (type == VECTOR) {
            int idx = (int)key.toInt();
            if (idx < 0 || idx >= (int)vecVal.size()) {
                throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
            }
            return vecVal[idx];
        }
        if (type == STRING) {
            int idx = (int)key.toInt();
            if (idx < 0 || idx >= (int)strVal.length()) {
                throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
            }
            return Value(std::string(1, strVal[idx]));
        }
        return Value();
    }
    Value& operator[](const std::string& key) {
        if (type != MAP) {
            type = MAP;
            intVal = 0; floatVal = 0.0; boolVal = true;
            mapVal.clear();
        }
        return mapVal[key];
    }
    Value operator[](const std::string& key) const {
        if (type != MAP) return Value();
        auto it = mapVal.find(key);
        if (it != mapVal.end()) return it->second;
        return Value();
    }
    Value& operator[](const char* key) {
        return (*this)[std::string(key)];
    }
    Value operator[](const char* key) const {
        return (*this)[std::string(key)];
    }
    Value& operator[](int idx) {
        if (type != VECTOR) {
            type = VECTOR;
            vecVal.clear();
        }
        if (idx < 0 || idx >= (int)vecVal.size()) {
            throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
        }
        return vecVal[idx];
    }
    Value operator[](int idx) const {
        if (type != VECTOR) return Value();
        if (idx < 0 || idx >= (int)vecVal.size()) {
            throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
        }
        return vecVal[idx];
    }

    // Range support for 'each' loop
    const std::vector<Value>& getVector() const {
        return vecVal;
    }

    // --- List Methods ---
    // --- Polymorphic and List Methods ---
    Value len() const {
        if (type == STRING) return Value((long long)strVal.length());
        if (type == VECTOR) return Value((long long)vecVal.size());
        if (type == MAP) return Value((long long)mapVal.size());
        return Value(0LL);
    }

    Value add(const Value& val) {
        if (type != VECTOR) {
            type = VECTOR;
            vecVal.clear();
        }
        vecVal.push_back(val);
        return *this;
    }

    Value insert(const Value& idxVal, const Value& val) {
        if (type != VECTOR) {
            type = VECTOR;
            vecVal.clear();
        }
        int idx = (int)idxVal.toInt();
        if (idx < 0 || idx > (int)vecVal.size()) {
            throw AniKodeError("Insert index out of bounds", "IndexError", __anikode_line);
        }
        vecVal.insert(vecVal.begin() + idx, val);
        return *this;
    }

    Value remove(const Value& val) {
        if (type == MAP) {
            std::string k = val.toString();
            auto it = mapVal.find(k);
            if (it != mapVal.end()) {
                mapVal.erase(it);
                return Value(true);
            }
            return Value(false);
        }
        if (type == VECTOR) {
            auto it = std::find(vecVal.begin(), vecVal.end(), val);
            if (it != vecVal.end()) {
                vecVal.erase(it);
                return Value(true);
            }
            return Value(false);
        }
        return Value(false);
    }

    Value removeAt(const Value& idxVal) {
        if (type != VECTOR) throw AniKodeError("Operation on non-list", "TypeError", __anikode_line);
        int idx = (int)idxVal.toInt();
        if (idx < 0 || idx >= (int)vecVal.size()) {
            throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
        }
        Value deleted = vecVal[idx];
        vecVal.erase(vecVal.begin() + idx);
        return deleted;
    }

    Value removeIf(const Value& val) {
        if (type != VECTOR) return Value(false);
        size_t initSize = vecVal.size();
        vecVal.erase(std::remove(vecVal.begin(), vecVal.end(), val), vecVal.end());
        return Value(vecVal.size() != initSize);
    }

    Value pop() {
        if (type != VECTOR || vecVal.empty()) throw AniKodeError("Pop from empty or non-list", "IndexError", __anikode_line);
        Value val = vecVal.back();
        vecVal.pop_back();
        return val;
    }
    Value pop(const Value& idxVal) {
        return removeAt(idxVal);
    }

    Value clear() {
        if (type == VECTOR) vecVal.clear();
        if (type == MAP) mapVal.clear();
        if (type == STRING) strVal.clear();
        return *this;
    }

    Value find(const Value& val) const {
        if (type == STRING) {
            size_t pos = strVal.find(val.toString());
            if (pos == std::string::npos) return Value(-1LL);
            return Value((long long)pos);
        }
        if (type == VECTOR) {
            auto it = std::find(vecVal.begin(), vecVal.end(), val);
            if (it != vecVal.end()) {
                return Value((long long)(it - vecVal.begin()));
            }
            return Value(-1LL);
        }
        return Value(-1LL);
    }

    Value has(const Value& val) const {
        if (type == STRING) {
            return Value(strVal.find(val.toString()) != std::string::npos);
        }
        if (type == VECTOR) {
            auto it = std::find(vecVal.begin(), vecVal.end(), val);
            return Value(it != vecVal.end());
        }
        if (type == MAP) {
            return Value(mapVal.find(val.toString()) != mapVal.end());
        }
        return Value(false);
    }

    Value count(const Value& val) const {
        if (type == STRING) {
            std::string sub = val.toString();
            if (sub.empty()) return Value(0LL);
            long long c = 0;
            size_t pos = 0;
            while ((pos = strVal.find(sub, pos)) != std::string::npos) {
                c++;
                pos += sub.length();
            }
            return Value(c);
        }
        if (type == VECTOR) {
            long long c = std::count(vecVal.begin(), vecVal.end(), val);
            return Value(c);
        }
        return Value(0LL);
    }

    Value first() const {
        if (type != VECTOR || vecVal.empty()) throw AniKodeError("Accessing empty or non-list", "IndexError", __anikode_line);
        return vecVal.front();
    }

    Value last() const {
        if (type != VECTOR || vecVal.empty()) throw AniKodeError("Accessing empty or non-list", "IndexError", __anikode_line);
        return vecVal.back();
    }

    Value get(const Value& idxVal) const {
        return (*this)[(int)idxVal.toInt()];
    }

    Value set(const Value& idxVal, const Value& val) {
        (*this)[(int)idxVal.toInt()] = val;
        return *this;
    }

    Value copy() const {
        return *this;
    }

    Value slice(const Value& startVal) const {
        if (type == STRING) {
            int s = (int)startVal.toInt();
            if (s < 0) s = 0;
            if (s > (int)strVal.length()) s = (int)strVal.length();
            return Value(strVal.substr(s));
        }
        if (type == VECTOR) {
            int s = (int)startVal.toInt();
            if (s < 0) s = 0;
            if (s > (int)vecVal.size()) s = (int)vecVal.size();
            std::vector<Value> sub(vecVal.begin() + s, vecVal.end());
            return Value(sub);
        }
        throw AniKodeError("Method .slice() requires List or String", "TypeError", __anikode_line);
    }
    Value slice(const Value& startVal, const Value& endVal) const {
        if (type == STRING) {
            int s = (int)startVal.toInt();
            int e = (int)endVal.toInt();
            if (s < 0) s = 0;
            if (e > (int)strVal.length()) e = (int)strVal.length();
            if (s >= e) return Value("");
            return Value(strVal.substr(s, e - s));
        }
        if (type == VECTOR) {
            int s = (int)startVal.toInt();
            int e = (int)endVal.toInt();
            if (s < 0) s = 0;
            if (e > (int)vecVal.size()) e = (int)vecVal.size();
            if (s >= e) return Value(std::vector<Value>());
            std::vector<Value> sub(vecVal.begin() + s, vecVal.begin() + e);
            return Value(sub);
        }
        throw AniKodeError("Method .slice() requires List or String", "TypeError", __anikode_line);
    }

    Value sort() {
        if (type == VECTOR) {
            std::sort(vecVal.begin(), vecVal.end());
        }
        return *this;
    }

    Value reverse() {
        if (type == STRING) {
            std::string s = strVal;
            std::reverse(s.begin(), s.end());
            return Value(s);
        }
        if (type == VECTOR) {
            std::reverse(vecVal.begin(), vecVal.end());
        }
        return *this;
    }

    Value shuffle() {
        if (type == VECTOR) {
            std::random_device rd;
            std::mt19937 g(rd());
            std::shuffle(vecVal.begin(), vecVal.end(), g);
        }
        return *this;
    }

    Value unique() {
        if (type == VECTOR) {
            auto it = std::unique(vecVal.begin(), vecVal.end());
            vecVal.erase(it, vecVal.end());
        }
        return *this;
    }

    Value swap(const Value& i1, const Value& i2) {
        if (type != VECTOR) return *this;
        int idx1 = (int)i1.toInt();
        int idx2 = (int)i2.toInt();
        if (idx1 < 0 || idx1 >= (int)vecVal.size() || idx2 < 0 || idx2 >= (int)vecVal.size()) {
            throw AniKodeError("Swap index out of bounds", "IndexError", __anikode_line);
        }
        std::swap(vecVal[idx1], vecVal[idx2]);
        return *this;
    }

    Value replace(const Value& oldVal, const Value& newVal) {
        if (type == STRING) {
            std::string s = strVal;
            std::string o = oldVal.toString();
            std::string n = newVal.toString();
            if (o.empty()) return *this;
            size_t pos = 0;
            while ((pos = s.find(o, pos)) != std::string::npos) {
                s.replace(pos, o.length(), n);
                pos += n.length();
            }
            return Value(s);
        }
        if (type == VECTOR) {
            long long count = 0;
            for (size_t i = 0; i < vecVal.size(); ++i) {
                if (vecVal[i] == oldVal) {
                    vecVal[i] = newVal;
                    count++;
                }
            }
            return Value(count);
        }
        return Value(0LL);
    }

    Value join(const Value& sep) const {
        if (type != VECTOR) return Value("");
        std::string res = "";
        std::string s = sep.toString();
        for (size_t i = 0; i < vecVal.size(); ++i) {
            res += vecVal[i].toString();
            if (i + 1 < vecVal.size()) res += s;
        }
        return Value(res);
    }

    Value empty() const {
        if (type == STRING) return Value(strVal.empty());
        if (type == VECTOR) return Value(vecVal.empty());
        if (type == MAP) return Value(mapVal.empty());
        return Value(true);
    }

    Value random() const {
        if (type == VECTOR) {
            if (vecVal.empty()) return Value();
            std::random_device rd;
            std::mt19937 g(rd());
            std::uniform_int_distribution<> distr(0, vecVal.size() - 1);
            return vecVal[distr(g)];
        }
        return Value();
    }

    // --- String Specific Methods ---
    Value upper() const {
        if (type != STRING) throw AniKodeError("Method .upper() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::transform(s.begin(), s.end(), s.begin(), ::toupper);
        return Value(s);
    }

    Value lower() const {
        if (type != STRING) throw AniKodeError("Method .lower() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::transform(s.begin(), s.end(), s.begin(), ::tolower);
        return Value(s);
    }

    Value trim() const {
        if (type != STRING) throw AniKodeError("Method .trim() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
            return !std::isspace(ch);
        }));
        s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
            return !std::isspace(ch);
        }).base(), s.end());
        return Value(s);
    }

    Value split(const Value& sepVal) const {
        if (type != STRING) throw AniKodeError("Method .split() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::string sep = sepVal.toString();
        std::vector<Value> res;
        if (sep.empty()) {
            for (char c : s) {
                res.push_back(Value(std::string(1, c)));
            }
            return Value(res);
        }
        size_t pos = 0;
        while ((pos = s.find(sep)) != std::string::npos) {
            res.push_back(Value(s.substr(0, pos)));
            s.erase(0, pos + sep.length());
        }
        res.push_back(Value(s));
        return Value(res);
    }

    Value replaceFirst(const Value& oldVal, const Value& newVal) const {
        if (type != STRING) throw AniKodeError("Method .replaceFirst() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::string o = oldVal.toString();
        std::string n = newVal.toString();
        if (o.empty()) return *this;
        size_t pos = s.find(o);
        if (pos != std::string::npos) {
            s.replace(pos, o.length(), n);
        }
        return Value(s);
    }

    Value char_at(const Value& idxVal) const {
        if (type != STRING) throw AniKodeError("Method .char() requires String", "TypeError", __anikode_line);
        int idx = (int)idxVal.toInt();
        if (idx < 0 || idx >= (int)strVal.length()) {
            throw AniKodeError("Index out of bounds", "IndexError", __anikode_line);
        }
        return Value(std::string(1, strVal[idx]));
    }

    Value repeat(const Value& countVal) const {
        if (type != STRING) throw AniKodeError("Method .repeat() requires String", "TypeError", __anikode_line);
        long long count = countVal.toInt();
        if (count < 0) {
            throw AniKodeError("Repeat count must be non-negative", "RangeError", __anikode_line);
        }
        std::string s = "";
        for (long long i = 0; i < count; ++i) {
            s += strVal;
        }
        return Value(s);
    }

    Value startsWith(const Value& prefixVal) const {
        if (type != STRING) throw AniKodeError("Method .startsWith() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::string prefix = prefixVal.toString();
        return Value(s.rfind(prefix, 0) == 0);
    }

    Value endsWith(const Value& suffixVal) const {
        if (type != STRING) throw AniKodeError("Method .endsWith() requires String", "TypeError", __anikode_line);
        std::string s = strVal;
        std::string suffix = suffixVal.toString();
        if (suffix.length() > s.length()) return Value(false);
        return Value(s.compare(s.length() - suffix.length(), suffix.length(), suffix) == 0);
    }

    // --- Dictionary Specific Methods ---
    Value keys() const {
        if (type != MAP) throw AniKodeError("Method .keys() requires Dictionary", "TypeError", __anikode_line);
        std::vector<Value> res;
        for (auto const& [key, val] : mapVal) {
            res.push_back(Value(key));
        }
        return Value(res);
    }

    Value values() const {
        if (type != MAP) throw AniKodeError("Method .values() requires Dictionary", "TypeError", __anikode_line);
        std::vector<Value> res;
        for (auto const& [key, val] : mapVal) {
            res.push_back(val);
        }
        return Value(res);
    }
};

inline Value operator-(const Value& a) {
    if (a.type == Value::FLOAT) return Value(-a.floatVal);
    return Value(-a.intVal);
}

inline Value operator+(const Value& a) {
    return a;
}

inline Value operator+(const Value& a, const Value& b) {
    if (a.type == Value::STRING || b.type == Value::STRING) {
        return Value(a.toString() + b.toString());
    }
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) {
        return Value(a.toDouble() + b.toDouble());
    }
    return Value(a.toInt() + b.toInt());
}

inline Value operator-(const Value& a, const Value& b) {
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) {
        return Value(a.toDouble() - b.toDouble());
    }
    return Value(a.toInt() - b.toInt());
}

inline Value operator*(const Value& a, const Value& b) {
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) {
        return Value(a.toDouble() * b.toDouble());
    }
    return Value(a.toInt() * b.toInt());
}

inline Value operator/(const Value& a, const Value& b) {
    double bVal = b.toDouble();
    if (bVal == 0.0) throw AniKodeError("Division by zero", "DivisionByZeroError", __anikode_line);
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) {
        return Value(a.toDouble() / bVal);
    }
    return Value(a.toInt() / b.toInt());
}

inline Value operator%(const Value& a, const Value& b) {
    long long bVal = b.toInt();
    if (bVal == 0) throw AniKodeError("Division by zero in modulo", "DivisionByZeroError", __anikode_line);
    return Value(a.toInt() % bVal);
}

inline bool operator==(const Value& a, const Value& b) {
    if (a.type == Value::STRING || b.type == Value::STRING) return a.toString() == b.toString();
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) return a.toDouble() == b.toDouble();
    return a.toInt() == b.toInt();
}

inline bool operator!=(const Value& a, const Value& b) { return !(a == b); }

inline bool operator<(const Value& a, const Value& b) {
    if (a.type == Value::STRING || b.type == Value::STRING) return a.toString() < b.toString();
    if (a.type == Value::FLOAT || b.type == Value::FLOAT) return a.toDouble() < b.toDouble();
    return a.toInt() < b.toInt();
}
inline bool operator>(const Value& a, const Value& b) { return b < a; }
inline bool operator<=(const Value& a, const Value& b) { return !(b < a); }
inline bool operator>=(const Value& a, const Value& b) { return !(a < b); }

// AniKode Standard Utilities
inline Value int_fn(const Value& v) { return Value(v.toInt()); }
inline Value float_fn(const Value& v) { return Value(v.toDouble()); }
inline Value str_fn(const Value& v) { return Value(v.toString()); }

inline Value file_read_fn(const Value& pathVal) {
    std::string path = pathVal.toString();
    std::ifstream file(path);
    if (!file.is_open()) {
        throw AniKodeError("Failed to open file: " + path, "FileError", __anikode_line);
    }
    std::stringstream buffer;
    buffer << file.rdbuf();
    return Value(buffer.str());
}

inline Value file_write_fn(const Value& pathVal, const Value& contentVal) {
    std::string path = pathVal.toString();
    std::ofstream file(path);
    if (!file.is_open()) {
        throw AniKodeError("Failed to open file for writing: " + path, "FileError", __anikode_line);
    }
    file << contentVal.toString();
    return Value();
}

inline Value __say_in(const Value& prompt = Value("")) {
    std::string pStr = prompt.toString();
    if (!pStr.empty()) {
        std::cout << pStr;
        std::cout.flush();
    }
    std::string line;
    std::getline(std::cin, line);
    return Value(line);
}

template<typename... Args>
inline void __say_out(Args... args) {
    Value vals[] = { Value(args)... };
    size_t n = sizeof...(args);
    for (size_t i = 0; i < n; ++i) {
        std::cout << vals[i].toString();
        if (i + 1 < n) std::cout << " ";
    }
    std::cout << "\\n";
}
inline void __say_out() {
    std::cout << "\\n";
}

struct MathNamespace {
    double pi = 3.141592653589793;
    double e = 2.718281828459045;
    Value abs(const Value& x) { return Value(std::abs(x.toDouble())); }
    Value min(const Value& a, const Value& b) { return Value(std::min(a.toDouble(), b.toDouble())); }
    Value max(const Value& a, const Value& b) { return Value(std::max(a.toDouble(), b.toDouble())); }
    Value pow(const Value& x, const Value& y) { return Value(std::pow(x.toDouble(), y.toDouble())); }
    Value sqrt(const Value& x) { return Value(std::sqrt(x.toDouble())); }
    Value floor(const Value& x) { return Value((long long)std::floor(x.toDouble())); }
    Value ceil(const Value& x) { return Value((long long)std::ceil(x.toDouble())); }
    Value round(const Value& x) { return Value((long long)std::round(x.toDouble())); }
    Value sin(const Value& x) { return Value(std::sin(x.toDouble())); }
    Value cos(const Value& x) { return Value(std::cos(x.toDouble())); }
    Value tan(const Value& x) { return Value(std::tan(x.toDouble())); }
    Value log(const Value& x) { return Value(std::log(x.toDouble())); }
    Value log10(const Value& x) { return Value(std::log10(x.toDouble())); }
    Value exp(const Value& x) { return Value(std::exp(x.toDouble())); }
    Value clamp(const Value& val, const Value& minVal, const Value& maxVal) {
        double v = val.toDouble();
        double mn = minVal.toDouble();
        double mx = maxVal.toDouble();
        return Value(std::max(mn, std::min(mx, v)));
    }
    Value random() {
        static std::mt19937 gen(std::random_device{}());
        std::uniform_real_distribution<double> dis(0.0, 1.0);
        return Value(dis(gen));
    }
    Value random(const Value& minVal, const Value& maxVal) {
        static std::mt19937 gen(std::random_device{}());
        if (minVal.type == Value::INT && maxVal.type == Value::INT) {
            long long mn = minVal.intVal;
            long long mx = maxVal.intVal;
            std::uniform_int_distribution<long long> dis(mn, mx);
            return Value(dis(gen));
        } else {
            double mn = minVal.toDouble();
            double mx = maxVal.toDouble();
            std::uniform_real_distribution<double> dis(mn, mx);
            return Value(dis(gen));
        }
    }
} math;

inline Value all_fn(const Value& coll) {
    if (coll.type != Value::VECTOR) throw AniKodeError("Built-in function all() requires a List", "TypeError", __anikode_line);
    for (const auto& item : coll.getVector()) {
        if (!item.boolVal) return Value(false);
    }
    return Value(true);
}

inline Value any_fn(const Value& coll) {
    if (coll.type != Value::VECTOR) throw AniKodeError("Built-in function any() requires a List", "TypeError", __anikode_line);
    for (const auto& item : coll.getVector()) {
        if (item.boolVal) return Value(true);
    }
    return Value(false);
}
`;
  }

  generate(node) {
    if (!node) return '';
    if (node.disabled === true) return '';

    switch (node.type) {
      case 'Program':
        this.scopes = [new Set()];
        this.currentFunctionName = null;
        this.functionDeclarations = [];
        let bodyStatements = [];
        let functions = [];

        for (let stmt of node.statements) {
          if (stmt.type === 'FunctionDeclaration') {
            functions.push(this.generate(stmt));
          } else {
            let compiled = this.generate(stmt);
            if (compiled !== '') bodyStatements.push('  ' + compiled);
          }
        }

        let cppCode = `#define type_check_logical true\n#include <functional>\nint __anikode_line = 1;\n` + this.getRuntimeHeader() + '\n\n';
        if (functions.length > 0) {
          cppCode += functions.join('\n\n') + '\n\n';
        }
        cppCode += 'int main() {\n' + bodyStatements.join('\n') + '\n  return 0;\n}\n';
        return cppCode;

      case 'VarDeclaration':
        if (!this.isDeclared(node.name)) {
          this.declare(node.name);
          return `__anikode_line = ${node.line || 1};\nValue ${node.name} = ${this.generate(node.value)};`;
        } else {
          return `__anikode_line = ${node.line || 1};\n${node.name} = ${this.generate(node.value)};`;
        }

      case 'Assignment':
        let linePrefix = `__anikode_line = ${node.line || 1};\n`;
        if (node.left) {
          return `${linePrefix}${this.generate(node.left)} = ${this.generate(node.value)};`;
        }
        if (!this.isDeclared(node.name)) {
          this.declare(node.name);
          return `${linePrefix}Value ${node.name} = ${this.generate(node.value)};`;
        } else {
          return `${linePrefix}${node.name} = ${this.generate(node.value)};`;
        }

      case 'SayOutStatement':
        let exprs = node.expressions || [node.expression];
        return `__anikode_line = ${node.line || 1};\n__say_out(${exprs.map(e => this.generate(e)).join(', ')});`;

      case 'SayInExpression':
        return `__say_in(${node.prompt ? this.generate(node.prompt) : 'Value("")'})`;

      case 'ExpressionStatement':
        return `__anikode_line = ${node.line || 1};\n${this.generate(node.expression)};`;

      case 'IfStatement':
        let code = `if (${this.generate(node.condition)}) {\n`;
        this.pushScope();
        code += this.generate(node.consequence);
        this.popScope();
        code += '\n}';

        if (node.alternative) {
          code += ' else ';
          if (node.alternative.type === 'IfStatement') {
            code += this.generate(node.alternative);
          } else {
            code += '{\n';
            this.pushScope();
            code += this.generate(node.alternative);
            this.popScope();
            code += '\n}';
          }
        }
        return code;

      case 'LoopStatement':
        let startVal = this.generate(node.start);
        let endVal = this.generate(node.end);
        let iter = node.iterator;

        this.pushScope();
        this.declare(iter);
        let bodyCode = this.generate(node.body);
        this.popScope();

        return `__anikode_line = ${node.line || 1};\n{\n  long long __start = (${startVal}).toInt();\n  long long __end = (${endVal}).toInt();\n  for (long long ${iter}_raw = __start; __start <= __end ? ${iter}_raw <= __end : ${iter}_raw >= __end; __start <= __end ? ${iter}_raw++ : ${iter}_raw--) {\n    Value ${iter}(${iter}_raw);\n${bodyCode}\n  }\n}`;

      case 'EachStatement':
        let collVal = this.generate(node.collection);
        let iterator = node.iterator;

        this.pushScope();
        this.declare(iterator);
        let eachBody = this.generate(node.body);
        this.popScope();

        return `__anikode_line = ${node.line || 1};\nfor (const auto& ${iterator} : (${collVal}).getVector()) {\n${eachBody}\n}`;

      case 'FunctionDeclaration':
        let oldFnName = this.currentFunctionName;
        this.currentFunctionName = node.name;

        this.pushScope();
        node.parameters.forEach(p => this.declare(p));
        let fnBody = this.generate(node.body);
        this.popScope();

        this.currentFunctionName = oldFnName;

        let paramList = node.parameters.map(p => `Value ${p}`).join(', ');
        return `Value ${node.name}(${paramList}) {\n${fnBody}\n  return Value();\n}`;

      case 'ReturnStatement':
        return `__anikode_line = ${node.line || 1};\nreturn ${node.value ? this.generate(node.value) : 'Value()'};`;

      case 'CallExpression':
        let callFn = node.function;
        if (callFn.type === 'MemberExpression') {
          let obj = this.generate(callFn.object);
          let prop = callFn.property.value;
          let argsList = node.arguments.map(arg => this.generate(arg)).join(', ');
          
          if (obj === 'file') {
            if (prop === 'read') return `file_read_fn(${argsList})`;
            if (prop === 'write') return `file_write_fn(${argsList})`;
          }
          if (prop === 'char') prop = 'char_at';
          return `(${obj}).${prop}(${argsList})`;
        }
        let callName = this.generate(node.function);
        if (callName === 'int') callName = 'int_fn';
        if (callName === 'float') callName = 'float_fn';
        if (callName === 'str') callName = 'str_fn';
        if (callName === 'all') callName = 'all_fn';
        if (callName === 'any') callName = 'any_fn';

        let callArgs = node.arguments.map(arg => this.generate(arg)).join(', ');
        return `${callName}(${callArgs})`;

      case 'RecurseExpression':
        if (!this.currentFunctionName) {
          throw new Error("Compilation Error: The 'recurse' keyword can only be used inside a function declaration.");
        }
        let recArgs = node.arguments.map(arg => this.generate(arg)).join(', ');
        return `${this.currentFunctionName}(${recArgs})`;

      case 'BlockStatement':
        return node.statements
          .map(stmt => this.generate(stmt))
          .filter(line => line !== '')
          .map(line => '  ' + line)
          .join('\n');

      case 'Identifier':
        if (node.value === 'int') return 'int_fn';
        if (node.value === 'float') return 'float_fn';
        if (node.value === 'str') return 'str_fn';
        return node.value;

      case 'NumberLiteral':
        return `Value(${node.value})`;

      case 'StringLiteral':
        return `Value(std::string(${JSON.stringify(node.value)}))`;

      case 'ArrayLiteral':
        let elems = node.elements.map(el => this.generate(el)).join(', ');
        return `Value(std::vector<Value>{ ${elems} })`;

      case 'IndexExpression':
        return `(${this.generate(node.left)})[${this.generate(node.index)}]`;

      case 'BooleanLiteral':
        return `Value(${node.value ? 'true' : 'false'})`;

      case 'NullLiteral':
        return `Value()`;

      case 'MemberExpression':
        if (node.object.type === 'Identifier' && node.object.value === 'math') {
          return `math.${node.property.value}`;
        }
        return `(${this.generate(node.object)})["${node.property.value}"]`;

      case 'AndExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; if (type_check_logical && l.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); if (!l.boolVal) return Value(false); Value r = ${this.generate(node.right)}; if (type_check_logical && r.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(r.boolVal); })()`;

      case 'OrExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; if (type_check_logical && l.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); if (l.boolVal) return Value(true); Value r = ${this.generate(node.right)}; if (type_check_logical && r.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(r.boolVal); })()`;

      case 'NotExpression':
        return `([&]() { Value v = ${this.generate(node.right)}; if (type_check_logical && v.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(!v.boolVal); })()`;

      case 'XorExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; Value r = ${this.generate(node.right)}; if (type_check_logical && (l.type != Value::BOOL || r.type != Value::BOOL)) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(l.boolVal != r.boolVal); })()`;

      case 'NandExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; if (type_check_logical && l.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); if (!l.boolVal) return Value(true); Value r = ${this.generate(node.right)}; if (type_check_logical && r.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(!r.boolVal); })()`;

      case 'NorExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; if (type_check_logical && l.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); if (l.boolVal) return Value(false); Value r = ${this.generate(node.right)}; if (type_check_logical && r.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(!r.boolVal); })()`;

      case 'XnorExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; Value r = ${this.generate(node.right)}; if (type_check_logical && (l.type != Value::BOOL || r.type != Value::BOOL)) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(l.boolVal == r.boolVal); })()`;

      case 'ImpliesExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; if (type_check_logical && l.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); if (!l.boolVal) return Value(true); Value r = ${this.generate(node.right)}; if (type_check_logical && r.type != Value::BOOL) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(r.boolVal); })()`;

      case 'IffExpression':
        return `([&]() { Value l = ${this.generate(node.left)}; Value r = ${this.generate(node.right)}; if (type_check_logical && (l.type != Value::BOOL || r.type != Value::BOOL)) throw AniKodeError("Logical operator requires Boolean operands", "TypeError", __anikode_line); return Value(l.boolVal == r.boolVal); })()`;

      case 'DictionaryLiteral':
        {
          let mapPairs = node.pairs.map(p => `{${JSON.stringify(p.key)}, ${this.generate(p.value)}}`).join(', ');
          return `Value(std::map<std::string, Value>{ ${mapPairs} })`;
        }

      case 'TryStatement':
        {
          let hasFinally = !!node.finallyBlock;
          let cppTry = `__anikode_line = ${node.line || 1};\n`;
          if (hasFinally) {
            cppTry += `{\n  struct FinallyBlock { std::function<void()> fn; ~FinallyBlock() { fn(); } } __finally([&]() {\n${this.generate(node.finallyBlock)}\n  });\n`;
          }
          cppTry += `try {\n${this.generate(node.tryBlock)}\n}`;
          
          if (node.catchBlocks.length > 0) {
            cppTry += ` catch (const AniKodeError& __err) {\n`;
            cppTry += `  Value __error = Value::makeError(__err);\n`;
            
            let handled = false;
            node.catchBlocks.forEach((cb, idx) => {
              let errorVar = cb.errorVar;
              this.pushScope();
              this.declare(errorVar);
              let body = this.generate(cb.body);
              this.popScope();

              let cond = `__error["type"] == ${JSON.stringify(cb.errorType)}`;
              if (cb.errorType === 'Error') {
                if (idx === 0) {
                  cppTry += `  {\n  Value ${errorVar} = __error;\n${body}\n  }\n`;
                  handled = true;
                } else {
                  cppTry += `  else {\n  Value ${errorVar} = __error;\n${body}\n  }\n`;
                }
              } else {
                if (idx === 0) {
                  cppTry += `  if (${cond}) {\n  Value ${errorVar} = __error;\n${body}\n  }\n`;
                } else {
                  cppTry += `  else if (${cond}) {\n  Value ${errorVar} = __error;\n${body}\n  }\n`;
                }
              }
            });
            if (!handled) {
              cppTry += `  else { throw; }\n`;
            }
            cppTry += `}`;
          }
          if (hasFinally) {
            cppTry += `\n}`;
          }
          return cppTry;
        }

      case 'ThrowStatement':
        {
          let valStr = this.generate(node.value);
          if (node.value && node.value.type === 'ErrorExpression') {
            return `__anikode_line = ${node.line || 1};\nthrow ${valStr};`;
          }
          return `__anikode_line = ${node.line || 1};\nthrow AniKodeError((${valStr}).toString(), "RuntimeError", __anikode_line);`;
        }

      case 'ErrorExpression':
        return `AniKodeError((${this.generate(node.message)}).toString(), "Error", __anikode_line)`;

      case 'PrefixExpression':
        return `(${node.operator}${this.generate(node.right)})`;

      case 'InfixExpression':
        return `(${this.generate(node.left)} ${node.operator} ${this.generate(node.right)})`;

      default:
        throw new Error(`CppCodeGen Error: Unknown AST node type: ${node.type}`);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CppCodeGenerator
  };
} else {
  window.CppCodeGenerator = CppCodeGenerator;
}
