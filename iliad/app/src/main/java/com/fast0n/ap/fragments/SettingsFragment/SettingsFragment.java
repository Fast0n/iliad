package com.fast0n.ap.fragments.SettingsFragment;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import com.fast0n.ap.R;
import com.fast0n.ap.java.CubeLoading;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SettingsFragment extends Fragment {

    public SettingsFragment() {
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        final View view = inflater.inflate(R.layout.fragment_settings, container, false);

        final ProgressBar loading;
        final Context context;
        context = Objects.requireNonNull(getActivity()).getApplicationContext();
        final RecyclerView recyclerView;
        final List<DataSettingsFragments> infoList = new ArrayList<>();
        String color, theme;
        SharedPreferences settings;


        // java adresses
        loading = view.findViewById(R.id.progressBar);
        settings = context.getSharedPreferences("sharedPreferences", 0);
        theme = settings.getString("toggleTheme", null);
        new CubeLoading(context, loading, theme).showLoading();
        recyclerView = view.findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        LinearLayoutManager llm = new LinearLayoutManager(context);
        llm.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(llm);

        if (theme.equals("0"))
            color = "#000";
        else
            color = "#ffffff";


        String[] list = {
                "<b><font color=" + color + ">" + getString(R.string.one_title) + "</fond></b><br><small>" + getString(R.string.one_description) + "</small>",
                "<b><font color=" + color + ">" + getString(R.string.two_title) + "</font></b><br><small>" + getString(R.string.two_description) + "</small>",
                "<b><font color=" + color + ">" + getString(R.string.four_title) + "</font></b><br><small>" + getString(R.string.four_description) + "</small>",
                "<b><font color=" + color + ">" + getString(R.string.five_title) + "</font></b><br><small>"};


        for (String a : list) {

            infoList.add(new DataSettingsFragments(a));
            CustomAdapterSettings ca = new CustomAdapterSettings(context, infoList);
            recyclerView.setAdapter(ca);
        }


        return view;
    }

}
