package com.fast0n.ap.fragments.CreditRoamingFragment;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.fast0n.ap.R;

import java.util.List;

public class CustomAdapterCreditRoaming extends RecyclerView.Adapter<CustomAdapterCreditRoaming.MyViewHolder> {

    private final List<DataCreditRoamingFragments> creditEsteroList;
    private final Context context;

    CustomAdapterCreditRoaming(Context context, List<DataCreditRoamingFragments> creditEsteroList) {
        this.context = context;
        this.creditEsteroList = creditEsteroList;
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        DataCreditRoamingFragments c = creditEsteroList.get(position);

        holder.textView2.setText(c.title);
        holder.textView3.setText(c.description);
        SharedPreferences settings = context.getSharedPreferences("sharedPreferences", 0);
        String theme = settings.getString("toggleTheme", null);
        if (theme.equals("0"))
            Glide.with(context).load(context.getString(R.string.site_url) + c.url).into(holder.icon_info);
        else
            Glide.with(context).load(context.getString(R.string.site_url) + c.url.replace(".png", "_dark.png")).into(holder.icon_info);

    }

    @Override
    public int getItemCount() {
        return creditEsteroList.size();
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.row_credit_roaming, parent, false);
        return new MyViewHolder(v);
    }

    class MyViewHolder extends RecyclerView.ViewHolder {

        final TextView textView2;
        final TextView textView3;
        final ImageView icon_info;

        MyViewHolder(View view) {
            super(view);
            textView2 = view.findViewById(R.id.textView2);
            textView3 = view.findViewById(R.id.textView3);
            icon_info = view.findViewById(R.id.icon_info);


        }
    }
}