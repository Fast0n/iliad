package com.fast0n.ipersonalarea.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.fast0n.ipersonalarea.R;
import com.fast0n.ipersonalarea.fragments.CreditFragment.CreditFragment;
import com.fast0n.ipersonalarea.fragments.CreditRoamingFragment.CreditRoamingFragment;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class MasterCreditFragment extends Fragment {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        final Context context;
        context = Objects.requireNonNull(getActivity()).getApplicationContext();

        // java adresses
        View view = inflater.inflate(R.layout.fragment_master_credit, container, false);
        ViewPager viewPager = view.findViewById(R.id.viewpager);
        final TextView credit = view.findViewById(R.id.creditText);
        final TextView description = view.findViewById(R.id.descriptionText);


        SharedPreferences settings = context.getSharedPreferences("sharedPreferences", 0);
        String token = settings.getString("token", null);
        SharedPreferences.Editor editor = settings.edit();
        editor.apply();

        final String site_url = getString(R.string.site_url);
        String url = site_url + "?credit=true&token=" + token;

        RequestQueue queue = Volley.newRequestQueue(context);

        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {

                            JSONObject json_raw = new JSONObject(response.toString());
                            String iliad = json_raw.getString("iliad");

                            JSONObject json = new JSONObject(iliad);
                            String string1 = json.getString("0");
                            JSONObject json_strings1 = new JSONObject(string1);
                            String stringCredit = json_strings1.getString("0");

                            credit.setText(stringCredit.split("&")[0]);
                            description.setText(stringCredit.split("&")[1]);

                        } catch (JSONException ignored) {
                        }

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });

        queue.add(getRequest);


        setupViewPager(viewPager);
        TabLayout tabs = view.findViewById(R.id.tabs);
        tabs.setupWithViewPager(viewPager);

        return view;

    }

    private void setupViewPager(ViewPager viewPager) {

        Adapter adapter = new Adapter(getChildFragmentManager());
        adapter.addFragment(new CreditFragment(), getString(R.string.italy));
        adapter.addFragment(new CreditRoamingFragment(), getString(R.string.estero));
        viewPager.setAdapter(adapter);

    }

    static class Adapter extends FragmentPagerAdapter {
        private final List<Fragment> mFragmentList = new ArrayList<>();
        private final List<String> mFragmentTitleList = new ArrayList<>();

        Adapter(FragmentManager manager) {
            super(manager);
        }

        @Override
        public Fragment getItem(int position) {
            return mFragmentList.get(position);
        }

        @Override
        public int getCount() {
            return mFragmentList.size();
        }

        void addFragment(Fragment fragment, String title) {
            mFragmentList.add(fragment);
            mFragmentTitleList.add(title);
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return mFragmentTitleList.get(position);
        }
    }

}