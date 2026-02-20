class InsightTools:

    @staticmethod
    def correlation_matrix(df):
        return df.corr(numeric_only=True).to_dict()

    @staticmethod
    def top_correlations(df, target_column):
        corr = df.corr(numeric_only=True)[target_column]
        return corr.sort_values(ascending=False).to_dict()
