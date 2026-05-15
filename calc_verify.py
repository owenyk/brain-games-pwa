import math

r = 0.00216667  # 月利率
M = 1192.23     # 原月供

# 原方案：280000本金，228期，1192.23月供
# 验证：用1192.23月供，280000本金，需要多少期？
P_original = 280000
n_original = -math.log(1 - P_original * r / M) / math.log(1 + r)
print(f"280000本金,月供1192.23: n={n_original:.2f}期")

# 用1192.23月供，270000本金（还10万提前还后），需要多少期？
P_new = 270000
n_new = -math.log(1 - P_new * r / M) / math.log(1 + r)
print(f"270000本金,月供1192.23: n={n_new:.2f}期")

# 反推：280000本金，228期，月供应该是多少？
P = 280000
n = 228
M_correct = P * r * (1+r)**n / ((1+r)**n - 1)
print(f"280000本金,228期,2.6%利率的正确月供={M_correct:.2f}")

# 用正确月供，270000本金，需要多少期？
n_new2 = -math.log(1 - P_new * r / M_correct) / math.log(1 + r)
print(f"270000本金,月供{M_correct:.2f}: n={n_new2:.2f}期")
